export class FilePosition {
    
    fileIndex: number
    inlineIndex: number
    lineNumber: number

    constructor(fileIndex:number, inlineIndex:number, lineNumber:number) {
        this.fileIndex = fileIndex
        this.inlineIndex = inlineIndex
        this.lineNumber = lineNumber
    }

}