import { Injectable } from '@angular/core';
import { IpcService } from '../ipc/ipc.service';
import { IpcChannel } from '../ipc/ipc-channels';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(private ipcService: IpcService) { 

  }

  getWorkingDirectory() {
    return this.ipcService.sendSync(IpcChannel.GetWorkingDirectory)
  }

}
