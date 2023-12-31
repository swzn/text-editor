import { Injectable } from '@angular/core';
import { IpcChannel } from 'src/app/ipc/ipc-channels';
import { IpcService } from 'src/app/ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private ipcService: IpcService
  ) { 
  }

  minimize() {
    this.ipcService.send(IpcChannel.Minimize)
  }

  maximize() {
    this.ipcService.send(IpcChannel.Maximize)
  }

  quit() {
    this.ipcService.send(IpcChannel.Quit)
  }

  unmaximize() {
    this.ipcService.send(IpcChannel.Unmaximize)
  }


}
