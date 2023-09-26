import { FileNode } from "src/app/types/filenode.type"

export class TabElement {
    file: FileNode
    originalHash: string
    edited: string = ""
    id: string
    position?: number
    element?: HTMLElement

    constructor(file: FileNode) {
        this.file = file
        this.id = Date.now().toString(16)
    }
}