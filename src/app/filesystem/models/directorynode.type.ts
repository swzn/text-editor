import { FileNode } from "./filenode.type";
import { Node } from "./node.type";

export class DirectoryNode implements Node {


    readonly path: string;

    readonly name: string;

    readonly depth: number;

    files: FileNode[];

    directories: DirectoryNode[];

    constructor(path: string, depth: number) {
        this.path = path
        this.name = path.substring(path.lastIndexOf('\\') + 1, path.length)
        this.depth = depth
        this.files = []
        this.directories = []
    }

    getFiles():FileNode[] {
        return this.files;
    }

    getDirectories(): DirectoryNode[] {
        return this.directories;
    }
}