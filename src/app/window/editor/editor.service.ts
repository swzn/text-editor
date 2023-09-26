import { AfterViewInit, Injectable } from '@angular/core';
import { EditorComponent } from './editor.component';
import { IpcService } from 'src/app/ipc/ipc.service';
import { IpcChannel } from 'src/app/ipc/ipc-channels';
import { FileNode } from 'src/app/types/filenode.type';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
@Injectable({
  providedIn: 'root'
})
export class EditorService {

  component: EditorComponent;

  private backupDir: string = "";
  
  constructor(
    private ipcService: IpcService,
    private fileSystem: FileSystemService
  ) { 
  }

  async setData(file: FileNode) {
    if(this.component.getTab(file)) {
      this.component.setFocus(file)
    }
    else {
      this.component.addTab(file)
    }
  }

  getData() {
    return this.component.content;
  }

  async getFileContents(path: string) {
    return await this.fileSystem.getFileContents(path)
  }

  saveTempFile(id: string, snapshot: string) {
    
    const tempPath = this.fileSystem.joinPaths(this.getBackupDir(), id)
    console.log(tempPath)
    this.saveFile(tempPath, snapshot)
  }

  private saveFile(path: string, data: string) {
    this.ipcService.invoke(IpcChannel.SaveFile, {data: data, path:path})
  }

  saveFilePrompt() {
    this.ipcService.invoke(IpcChannel.SaveFilePrompt, this.getData())
  }

  getBackupDir(): string {
    if(!this.backupDir || this.backupDir == "") this.backupDir = this.fileSystem.joinPaths(this.fileSystem.getRoamingDirectory(), "backups")
    return this.backupDir
  }

}
