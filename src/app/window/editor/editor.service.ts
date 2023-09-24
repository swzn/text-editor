import { Injectable } from '@angular/core';
import { EditorComponent } from './editor.component';
import { IpcService } from 'src/app/ipc/ipc.service';
import { IpcChannel } from 'src/app/ipc/ipc-channels';
import { FileNode } from 'src/app/types/filenode.type';
@Injectable({
  providedIn: 'root'
})
export class EditorService {

  component: EditorComponent;
  
  constructor(
    private ipcService: IpcService,
  ) { }

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

  saveFile() {
    this.ipcService.invoke(IpcChannel.SaveFile, this.getData())
  }


}
