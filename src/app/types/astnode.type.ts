import { ASTNodeType } from "./astnodetype.enum"
import { FilePosition } from "./fileposition.type"

export class ASTNode {
    type: ASTNodeType
    range: {start: FilePosition, end:FilePosition}
    children: ASTNode[]

    constructor(type: ASTNodeType) {
        this.type = type
        this.children = []
    }

    setStart(start: FilePosition) {
        this.range.start = start
    }

    setEnd(end:FilePosition) {
        this.range.end = end
    }

    toString() {
        `${this.type}[${this.range.start}:${this.range.end}]`
    }

    toStringRecursive(indent: number) {
        " ".repeat(indent) + this.toString() + this.children.forEach( e=> e.toStringRecursive(indent++))
    }
}