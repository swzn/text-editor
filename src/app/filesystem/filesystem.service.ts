import { Injectable } from '@angular/core';
import { IpcService } from '../ipc/ipc.service';
import { IpcChannel } from '../ipc/ipc-channels';
import { DirectoryNode } from '../types/directorynode.type';
import { FileNode } from '../types/filenode.type';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private roamingDirectory: string;

  constructor(private ipcService: IpcService) { 
    this.assignRoamingDirectory()
  }

  async assignRoamingDirectory() {
    this.ipcService.invoke(IpcChannel.GetRoamingDirectory).then((result)=> {
      this.roamingDirectory = result;
    })
  }

  getRoamingDirectory() {
    return this.roamingDirectory
  }

  getWorkingDirectory() {
    const workingTree = this.ipcService.sendSync(IpcChannel.GetWorkingDirectory)
    let dn = workingTree ? this.getDirectoryNodeFromWorkingTree(workingTree, 0) : undefined
    return dn
  }

  async getFileContents(filePath: string): Promise<string> {
    let fileContents: string = ""
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

  joinPaths(...paths:string[]) {
    let final: string[] = []
    for(let path of paths) {
      path.replaceAll('/', '\\')
      for(let name of path.split('/')) final.push(name)
    }
    return final.join("\\")
  } 
}
