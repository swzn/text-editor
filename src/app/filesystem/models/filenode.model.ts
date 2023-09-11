import { INode } from "./inode.model";

export class FileNode implements INode {

    readonly path: string;
    
    readonly name: string;

    readonly depth: number;

    constructor(path: string, depth: number) {
        this.name = path.substring(path.lastIndexOf('\\') + 1, path.length);
        this.path = path;
        this.depth = depth;
    }

}