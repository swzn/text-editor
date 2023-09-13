import { Component } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent {

  constructor(
    private menu: MenuService
  ) {
    
  }

  minimize() {
    this.menu.minimize()
  }

  unmaximize() {
    this.menu.unmaximize()
  }
}
