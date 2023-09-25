import { ElementRef } from "@angular/core"
import { FileNode } from "src/app/types/filenode.type"

export class TabElement {
    file: FileNode
    originalHash: string
    edited: string = ""
    position?: number
    element?: HTMLElement

    constructor(file: FileNode) {
        this.file = file
    }
}