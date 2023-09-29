import { Injectable } from "@angular/core";

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

@Injectable({
    providedIn: 'root'
})
export class LexerService {


    lex(string: string) {
    }

    tokenize() {
    }

}