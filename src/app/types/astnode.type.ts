import { ASTNodeType } from "./astnodetype.enum"

export class ASTNode {
    type: ASTNodeType
    range: {start: number, end:number}
    children: ASTNode[]

    constructor(type: ASTNodeType, start: number, end: number) {
        this.type = type
        this.range = {start:start, end:end}
        this.children = []
    }

    toString() {
        `${this.type}[start:end]`
    }

    toStringRecursive(indent: number) {
        " ".repeat(indent) + this.toString() + this.children.forEach( e=> e.toStringRecursive(indent++))
    }
}