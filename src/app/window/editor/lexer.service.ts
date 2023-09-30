import { ASTNode } from "src/app/types/astnode.type";
import { ASTNodeType } from "src/app/types/astnodetype.enum";


/** Keywords inspired from
 * https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
 * 
 * ecma-international ECMAScript 2023 standard
 * 
 * https://www.typescriptlang.org/docs/handbook/
 * 
 * TypeScript handboook
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

    tokenize(words: string): ASTNode {

        const root: ASTNode = new ASTNode(ASTNodeType.DEFAULT)
        root.setStart(0)
        root.setEnd(words.length - 1)
        const stack: ASTNode[] = [
            root
        ]
        const tokens: string[] = []
        let i = 0
        while(i < words.length) {
            const initialIndex = i
            if(i < words.length && OPENING_BRACKETS.includes(words.charAt(i))) {
                const node = new ASTNode(this.parseBracketEnum(words.charAt(i)))
                node.setStart(i)
                stack.push(node)
                i++
            }

            if(i < words.length && CLOSING_BRACKETS.includes(words.charAt(i))) {
                const node = stack.pop()
                node?.setEnd(i)
                if(node) stack[stack.length-1].children.push(node)
                i++
            }

            // Skip whitespace
            while(i < words.length && WHITESPACE.includes(words.charAt(i))) i++

            // Parse token
            const tokenItems: string[] = []
            while(i < words.length && this.isAlphanumerical(words.charAt(i))) {
                tokenItems.push(words.charAt(i))
                i++
            }

            if(i === initialIndex) i++
            let token = tokenItems.join("")

            if(token.length > 0) tokens.push(token)
        }
        return stack.pop() as ASTNode
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