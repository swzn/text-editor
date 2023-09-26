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

  async getFileContents(path: string) {
    return await this.fileSystem.getFileContents(path)
  }

  saveTempFile(id: string, snapshot: string) {
    const tempPath = this.fileSystem.joinPaths(this.getBackupDir(), id)
    this.fileSystem.saveFile(tempPath, snapshot)
  }

  saveFilePrompt(data: string) {
    this.fileSystem.saveFilePrompt(data)
  }

  getBackupDir(): string {
    if(!this.backupDir || this.backupDir == "") this.backupDir = this.fileSystem.joinPaths(this.fileSystem.getRoamingDirectory(), "backups")
    return this.backupDir
  }

}
