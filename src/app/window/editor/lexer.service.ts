import { Injectable } from "@angular/core";


/** Source
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

const BRACKETS = ['(', ')', '[', ']', '{', '}']

const OPERATORS = ["+", "-", "=", "==", "===", "!=", "!==", "<", ">", "<=", ">=", "++", "--"]

const SYNTAX = [";", ",", ":", "->", "=>"]

/** Source
 * https://developer.mozilla.org/en-US/docs/Glossary/Whitespace
 * 
 * Infra Living Standard ASCII Whitespace
 */
const WHITESPACE = [" ", "\t", "\n", "\r", "\f"]
@Injectable({
    providedIn: 'root'
})
export class LexerService {

    tokenize(words: string) {
        const tokens: string[] = []
        let i = 0
        while(words.charAt(i)) {

            // Skip whitespace
            while(words.charAt(i) && WHITESPACE.includes(words.charAt(i))) i++

            const tokenItems: string[] = []
            while(words.charAt(i) && this.isAlphanumerical(words.charAt(i))) {
                tokenItems.push(words.charAt(i))
                i++
            }
            let token = tokenItems.join("")

            if(token.length > 0) tokens.push(token)

            i++
        }
    }


    private isAlphanumerical(c: string) {
        let n: number = c.charCodeAt(0)
        return (n >= 48 && n <= 57) || (n >=65 && n <=90) || (n >= 97 && n <= 122)
    }

}