import { ASTNode } from "src/app/types/astnode.type";
import { ASTNodeType } from "src/app/types/astnodetype.enum";
import { FilePosition } from "src/app/types/fileposition.type";
import { LineElement } from "src/app/types/lineelement.type";
import { LineElementType } from "src/app/types/lineelementtype.enum";


/** Keywords inspired from
 * https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
 * 
 * ecma-international ECMAScript 2023 standard
 * 
 * https://www.typescriptlang.org/docs/handbook/
 * 
 * TypeScript handbook
 */

const KEYWORDS = [
    'private', 'public', 'static', 'export', 'class', 'let', 'var', 'catch',
    'const', 'break', 'any', 'as', 'switch', 'case', 'if', 'else', 'throw', 
    'set', 'get', 'module', 'instanceof', 'type', 'instanceof', 'typeof', 'in',
    'enum', 'finally', 'for', 'while', 'void', 'null', 'super', 'this', 'new',
    '...', 'return', 'false', 'extends', 'package', 'implements', 'interface',
    'function', 'try', 'yield', 'const', 'continue', 'do', 'async', 'await',
    'constructor', 'readonly', 'import', 'from'
]

const OPENING_BRACKETS = ['(', '[', '{']
const CLOSING_BRACKETS = [ ')', ']', '}']

const SINGLE_CHAR_OPERATORS = ["+", "-", "=", '.', '/', /*"==", "===", "!=", "!==",*/ "<", ">", /*"<=", ">=", "++", "--"*/]

const SYNTAX = [";", ",", ":", "->", "=>"]

const STRING = ["\'", "\"", "\`"]

/** Whitespace taken from
 * https://developer.mozilla.org/en-US/docs/Glossary/Whitespace
 * 
 * Infra Living Standard ASCII Whitespace
 */
const WHITESPACE = [" ", "\t", "\n", "\r", "\f"]
export class Lexer {

    /**
     * Benchmarked at
     * 7.21915237e-8 seconds / byte
     * 
     * Test configuration:
     * Tokenizing a 688kb file 10,000 times takes 545,316ms
     */
    tokenize(words: string): {root: ASTNode, lines: string[], lineElements: LineElement[][]} {

        const root: ASTNode = new ASTNode(ASTNodeType.DEFAULT)
        root.setStart(new FilePosition(0, 0, 0))
        let stack: ASTNode[] = [
            root
        ]
        const tokens: string[] = []
        let fileIndex = 0 // Char index in file
        let lineNumber = 0 // Current line number
        let inlineIndex = 0 // Char index in current line
        let currentLine = ""
        let flag: LineElementType | undefined

        const lines = []
        const lineElements: LineElement[][] = []
        let currentLineElements: LineElement[] = []
        const forward = (char?: string) => {
            fileIndex++
            inlineIndex++
            if(char) currentLine += char
        }

        const getCurrentPosition = (lineOffset: number = 0) => {
            return new FilePosition(fileIndex + lineOffset, inlineIndex + lineOffset, lineNumber)
        }

        const popStackAndPushChild = (lineOffset: number = 0) => {
            const node = stack.pop()
            node?.setEnd(getCurrentPosition(lineOffset))
            if(node) {
                if(stack[stack.length-1]) stack[stack.length-1].children.push(node)
                //else {console.log(lineElements); console.log(node)}
            }
            forward(words.charAt(fileIndex))        
        }

        const getLastPushedBlock = () => {
            return stack[stack.length-1].type
        }

        const checkFlaggedType = (type: LineElementType) => {
            if(!flag) return type
            else if(flag === LineElementType.COMMENT) return flag
            else if(flag === LineElementType.TYPE && type === LineElementType.DEFAULT) {
                flag = undefined
                return LineElementType.TYPE
            }
            return type
        }
        
        let bracketStack = 0
        while(fileIndex < words.length) {
            const initialIndex = fileIndex

            if(fileIndex < words.length && STRING.includes(words.charAt(fileIndex))) {
                let stringBuilder = ""
                if(flag === undefined) {
                    const starter = words.charAt(fileIndex)
                    stringBuilder += words.charAt(fileIndex)
                    forward()
                    while(fileIndex < words.length && words.charAt(fileIndex) != starter && words.charAt(fileIndex) != '\n') {
                        if(fileIndex+1 < words.length && words.charAt(fileIndex) == '\\') {
                            stringBuilder += words.charAt(fileIndex)
                            forward(words.charAt(fileIndex))
                            stringBuilder += words.charAt(fileIndex)
                            forward(words.charAt(fileIndex))
                            continue
                        }
                        stringBuilder += words.charAt(fileIndex)
                        forward()
                    }
                    if(words.charAt(fileIndex) === starter) {
                        stringBuilder += starter
                        currentLineElements.push(new LineElement(LineElementType.STRING, stringBuilder))
                        forward()
                    }
                    else {
                        currentLineElements.push(new LineElement(LineElementType.ERROR, stringBuilder))
                    }
                }
            }

            if(fileIndex+1 < words.length && words.charAt(fileIndex) == '/' && words.charAt(fileIndex+1) == '*') {
                stack.push(this.makeNode(ASTNodeType.COMMENTBLOCK, getCurrentPosition()))
                flag = LineElementType.COMMENT
                currentLineElements.push(new LineElement(LineElementType.COMMENT, words.charAt(fileIndex)))
                forward(words.charAt(fileIndex))
                currentLineElements.push(new LineElement(LineElementType.COMMENT, words.charAt(fileIndex)))
                forward(words.charAt(fileIndex))
                continue
            }

            if(fileIndex+1 < words.length && words.charAt(fileIndex) == '*' && words.charAt(fileIndex+1) == '/') {
                currentLineElements.push(new LineElement(LineElementType.COMMENT, words.charAt(fileIndex)))
                popStackAndPushChild(1)
                currentLineElements.push(new LineElement(LineElementType.COMMENT, words.charAt(fileIndex)))
                forward(words.charAt(fileIndex))
                flag = undefined
                continue
            }

            if(fileIndex < words.length && SYNTAX.includes(words.charAt(fileIndex))) {
                const type = checkFlaggedType(LineElementType.SYNTAX)
                currentLineElements.push(new LineElement(type, words.charAt(fileIndex)))
                if(type === LineElementType.SYNTAX && words.charAt(fileIndex) === ':') {
                    if(currentLineElements[currentLineElements.length-1] && currentLineElements[currentLineElements.length-1].type === LineElementType.DEFAULT) flag = LineElementType.TYPE
                }
                forward(words.charAt(fileIndex))
            }

            if(fileIndex < words.length && SINGLE_CHAR_OPERATORS.includes(words.charAt(fileIndex))) {
                currentLineElements.push(new LineElement(checkFlaggedType(LineElementType.SYNTAX), words.charAt(fileIndex)))
                forward(words.charAt(fileIndex))
            }
            if(fileIndex < words.length && OPENING_BRACKETS.includes(words.charAt(fileIndex))) {
                stack.push(this.makeNode(this.parseBracketEnum(words.charAt(fileIndex)), getCurrentPosition()) )
                const type = checkFlaggedType(LineElementType.BRACKET)
                currentLineElements.push(new LineElement(type, words.charAt(fileIndex),  {bracketStack: bracketStack}))
                bracketStack++;
                forward(words.charAt(fileIndex))
            }

            if(fileIndex < words.length && CLOSING_BRACKETS.includes(words.charAt(fileIndex))) {
                bracketStack--;
                const type = checkFlaggedType(LineElementType.BRACKET)
                currentLineElements.push(new LineElement(type, words.charAt(fileIndex),  {bracketStack: bracketStack}))
                popStackAndPushChild()
            }

            // Skip whitespace
            let renderableWhitespace = ""
            while(fileIndex < words.length && WHITESPACE.includes(words.charAt(fileIndex))) {
                if(words.charAt(fileIndex) == "\n") {
                    forward()
                    lineNumber++
                    inlineIndex = 0
                    if (flag === LineElementType.STRING) flag = undefined
                    lines.push(currentLine)
                    lineElements.push(currentLineElements)
                    currentLineElements = [] 
                    currentLine = ""
                    continue
                }
                if(words.charAt(fileIndex) === " " || words.charAt(fileIndex) === "\t") {
                    renderableWhitespace += words.charAt(fileIndex)
                    forward(words.charAt(fileIndex))
                }
            }
            if(renderableWhitespace.length > 0) currentLineElements.push(new LineElement(LineElementType.WHITESPACE, renderableWhitespace))

            // Parse token
            let token: string = ""
            while(fileIndex < words.length && this.isAlphanumerical(words.charAt(fileIndex))) {
                token += (words.charAt(fileIndex))
                forward(words.charAt(fileIndex))
            }
            if(token.length > 0) {
                tokens.push(token)
                if(KEYWORDS.includes(token)) {
                    currentLineElements.push(new LineElement(checkFlaggedType(LineElementType.KEYWORD), token))
                }
                else {
                    const type = stack.length <= 2 ? LineElementType.MEMBER : LineElementType.DEFAULT
                    currentLineElements.push(new LineElement(checkFlaggedType(type), token))
                }
                continue
            } 

            if(fileIndex === initialIndex) {
                currentLineElements.push(new LineElement(checkFlaggedType(LineElementType.DEFAULT), words.charAt(fileIndex)))
                forward(words.charAt(fileIndex))
            }
        }
        
        const result = stack.pop() as ASTNode
        result.setEnd(new FilePosition(fileIndex, inlineIndex, lineNumber))
        return {root: result, lines: lines, lineElements: lineElements}
    }


    private isAlphanumerical(c: string) {
        let n: number = c.charCodeAt(0)
        return (n >= 48 && n <= 57) || (n >=65 && n <=90) || (n >= 97 && n <= 122)
    }

    private parseBracketEnum(c: string):ASTNodeType {
        switch(c) {
            case '(':
            case ')':
                return ASTNodeType.PARAMETERBLOCK
            case '{':
            case '}':
                return ASTNodeType.CODEBLOCK
            case '[':
            case ']':
                return ASTNodeType.ARRAY
        }
        return ASTNodeType.DEFAULT
    }

    private makeNode(type: ASTNodeType, position: FilePosition): ASTNode {
        const node = new ASTNode(type)
        node.setStart(position)
        return node 
    }

}