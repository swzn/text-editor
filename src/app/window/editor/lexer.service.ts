import { ASTNode } from "src/app/types/astnode.type";
import { ASTNodeType } from "src/app/types/astnodetype.enum";
import { FilePosition } from "src/app/types/fileposition.type";


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
    'function', 'try', 'yield', 'const', 'continue', 'do', 'async', 'await'
]

const OPENING_BRACKETS = ['(', '[', '{']
const CLOSING_BRACKETS = [ ')', ']', '}']

const OPERATORS = ["+", "-", "=", "==", "===", "!=", "!==", "<", ">", "<=", ">=", "++", "--"]

const SYNTAX = [";", ",", ":", "->", "=>"]

/** Whitespace taken from
 * https://developer.mozilla.org/en-US/docs/Glossary/Whitespace
 * 
 * Infra Living Standard ASCII Whitespace
 */
const WHITESPACE = [" ", "\t", "\n", "\r", "\f"]
export class Lexer {

    tokenize(words: string): {root: ASTNode, lines: string[]} {

        const root: ASTNode = new ASTNode(ASTNodeType.DEFAULT)
        root.setStart(new FilePosition(0, 0, 0))
        const stack: ASTNode[] = [
            root
        ]
        const tokens: string[] = []
        let fileIndex = 0 // Char index in file
        let lineNumber = 0 // Current line number
        let inlineIndex = 0 // Char index in current line
        let currentLine = ""
        const lines = []
        const forward = (char?: string) => {
            fileIndex++
            inlineIndex++
            if(char) currentLine += char
        }
        while(fileIndex < words.length) {
            const initialIndex = fileIndex
            if(fileIndex < words.length && OPENING_BRACKETS.includes(words.charAt(fileIndex))) {
                const node = new ASTNode(this.parseBracketEnum(words.charAt(fileIndex)))
                node.setStart(new FilePosition(lineNumber, inlineIndex, fileIndex))
                stack.push(node)
                forward(words.charAt(fileIndex))
            }

            if(fileIndex < words.length && CLOSING_BRACKETS.includes(words.charAt(fileIndex))) {
                const node = stack.pop()
                node?.setEnd(new FilePosition(lineNumber, inlineIndex, fileIndex))
                if(node) stack[stack.length-1].children.push(node)
                forward(words.charAt(fileIndex))
            }

            // Skip whitespace
            while(fileIndex < words.length && WHITESPACE.includes(words.charAt(fileIndex))) {
                if(words.charAt(fileIndex) == "\n") {
                    forward()
                    lineNumber++
                    inlineIndex = 0
                    lines.push(currentLine)
                    currentLine = ""
                }
                if(words.charAt(fileIndex) === " " || words.charAt(fileIndex) === "\t") forward(words.charAt(fileIndex))
            }

            // Parse token
            const tokenItems: string[] = []
            while(fileIndex < words.length && this.isAlphanumerical(words.charAt(fileIndex))) {
                tokenItems.push(words.charAt(fileIndex))
                forward(words.charAt(fileIndex))
            }

            if(fileIndex === initialIndex) forward(words.charAt(fileIndex))
            let token = tokenItems.join("")

            if(token.length > 0) tokens.push(token)
        }
        
        const result = stack.pop() as ASTNode
        result.setEnd(new FilePosition(lineNumber, inlineIndex, fileIndex))
        return {root: result, lines: lines}
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

}