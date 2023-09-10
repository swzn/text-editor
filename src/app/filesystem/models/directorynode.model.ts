import { FileNode } from "./filenode.model";

export class DirectoryNode {


    readonly path: string;

    files: FileNode[];

    directories: DirectoryNode[];

    constructor(path: string) {
        this.path = path;
    }

}