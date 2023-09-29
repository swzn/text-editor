import { ASTNodeType } from "./astnodetype.enum"

export class ASTNode {
    type: ASTNodeType
    range: {start: number, end:number}
    children: ASTNode[]

    constructor(type: ASTNodeType) {
        this.type = type
        this.children = []
    }

    setStart(start: number) {
        this.range.start = start
    }

    setEnd(end:number) {
        this.range.end = end
    }

    toString() {
        `${this.type}[${this.range.start}:${this.range.end}]`
    }

    toStringRecursive(indent: number) {
        " ".repeat(indent) + this.toString() + this.children.forEach( e=> e.toStringRecursive(indent++))
    }
}