import { ASTNodeType } from "./astnodetype.enum"
import { FilePosition } from "./fileposition.type"

export class ASTNode {
    type: ASTNodeType
    range: {start: FilePosition | undefined, end:FilePosition | undefined}
    children: ASTNode[]

    constructor(type: ASTNodeType) {
        this.type = type
        this.children = []
        this.range = {start: undefined, end: undefined}
    }

    setStart(start: FilePosition) {
        this.range.start = start
    }

    setEnd(end:FilePosition) {
        this.range.end = end
    }

    toString() {
        return `${this.type}[${this.range.start}:${this.range.end}]`
    }

    toStringRecursive(indent?: number) {
        return " ".repeat(indent? indent : 0) + this.toString() + this.children.forEach( e=> e.toStringRecursive(indent? indent++ : 1))
    }
}