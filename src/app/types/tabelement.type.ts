import { FileNode } from "src/app/types/filenode.type"

export class TabElement {
    file: FileNode
    element?: HTMLDivElement
    edited?: boolean

    constructor(file: FileNode) {
        this.file = file
    }
}