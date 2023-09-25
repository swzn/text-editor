import { ElementRef } from "@angular/core"
import { FileNode } from "src/app/types/filenode.type"

export class TabElement {
    file: FileNode
    position?: number
    element?: HTMLElement
    edited?: boolean

    constructor(file: FileNode) {
        this.file = file
    }
}