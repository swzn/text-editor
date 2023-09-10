import { Injectable } from '@angular/core';
import { ipcRenderer, IpcRendererEvent } from 'electron';

@Injectable({
  providedIn: 'root'
})

export class IpcService {

  setOnListener(channel:string, callback:(event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.on(channel, callback)
  }

  setOnceListener(channel:string, callback:(event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.once(channel, callback)
  }

}
