import { Injectable } from '@angular/core';
import { EditorComponent } from './editor.component';
import { IpcService } from 'src/app/ipc/ipc.service';
import { IpcChannel } from 'src/app/ipc/ipc-channels';
@Injectable({
  providedIn: 'root'
})
export class EditorService {


  component: EditorComponent;

  constructor(
    private ipcService: IpcService
  ) { }

  setData(data: any) {
    this.component.content = data;
  }

  getData() {
    return this.component.content;
  }

  saveFile() {
    this.ipcService.invoke(IpcChannel.SaveFile, this.getData())
  }

}
