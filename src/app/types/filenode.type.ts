import { Node } from "./node.type";

export class FileNode implements Node {

    readonly path: string;
    
    readonly name: string;

    readonly depth: number;

    constructor(path: string, depth: number) {
        this.name = path.substring(path.lastIndexOf('\\') + 1, path.length);
        this.path = path;
        this.depth = depth;
    }

}