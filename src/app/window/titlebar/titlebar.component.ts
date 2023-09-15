import { Component } from '@angular/core';
import { MenuService } from './menu.service';
import { IpcService } from 'src/app/ipc/ipc.service';
import { IpcChannel } from 'src/app/ipc/ipc-channels';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent {

  private windowMaximized: boolean
  

  constructor(
    private menu: MenuService,
    private ipcService: IpcService
  ) {
    this.ipcService.setOnListener(IpcChannel.UnmaximizedEvent, (e)=> {
      this.windowMaximized = false;
    })

    this.ipcService.setOnListener(IpcChannel.MaximizedEvent, (e)=> {
      this.windowMaximized = true;
    })
  }

  minimize() {
    this.menu.minimize()
  }

  maximize() {
    if(this.windowMaximized === true) this.menu.unmaximize()
    else this.menu.maximize()
  }

  quit() {
    this.menu.quit()
  }


}
