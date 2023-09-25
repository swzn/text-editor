import { Injectable } from '@angular/core';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcChannel } from './ipc-channels.js';

@Injectable({
  providedIn: 'root'
})

export class IpcService {

  async setOnListener(channel:IpcChannel, callback:(event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.on(channel.toString(), callback)
  }

  async setOnceListener(channel:IpcChannel, callback:(event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.once(channel.toString(), callback)
  }

  async send(channel: IpcChannel, ...args: any[]) {
    ipcRenderer.send(channel.toString(), args)
  }

  async invoke(channel: IpcChannel, ...args:any[]) {
    const output = await ipcRenderer.invoke(channel.toString(), args)
    return output
  }

  sendSync(channel: IpcChannel, ...args: any[]): any {
    return ipcRenderer.sendSync(channel.toString(), args)
  }

}
