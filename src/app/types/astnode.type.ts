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

    toString() : string {
        return `${this.type}[(${this.range.start?.lineNumber}:${this.range.start?.inlineIndex})-(${this.range.end?.lineNumber}:${this.range.end?.inlineIndex})]\n`
    }

    toStringRecursive(indent: number = 0) : string {
        return "+".repeat(indent > 0 ? 1 : 0) + "-".repeat(indent > 0 ? indent-1 : 0) + this.toString()+ this.children.map( e => e.toStringRecursive(indent + 1)).join('')
    }
}