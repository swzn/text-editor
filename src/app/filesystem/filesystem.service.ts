import { Injectable } from '@angular/core';
import { IpcService } from '../ipc/ipc.service';
import { IpcChannel } from '../ipc/ipc-channels';
import { DirectoryNode } from './models/directorynode.type';
import { FileNode } from './models/filenode.type';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(private ipcService: IpcService) { 

  }

  getWorkingDirectory() {
    const workingTree = this.ipcService.sendSync(IpcChannel.GetWorkingDirectory)
    let dn = workingTree ? this.getDirectoryNodeFromWorkingTree(workingTree, 0) : undefined
    return dn
  }

  async getFileContents(filePath: string) {
    let fileContents;
    await this.ipcService.invoke(IpcChannel.GetFile, filePath).then((result) => fileContents = result)
    return fileContents
  }


  getDirectoryNodeFromWorkingTree(workingTree: any, depth: number): DirectoryNode {
    let root = new DirectoryNode(workingTree.path, depth)
    workingTree.children.forEach( (child:any) => {

      if(child.type === 'file') {
        let childNode = new FileNode(child.path, depth + 1)
        root.files.push(childNode)
      }
      else if (child.type === 'directory') {
        let childNode = this.getDirectoryNodeFromWorkingTree(child, depth + 1)
        root.directories.push(childNode)
      }
      
    });
    return root;
  }
}
