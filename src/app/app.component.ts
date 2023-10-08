import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DockService } from './window/dock/dock.service';
import { Events } from './types/events.type';
import { IconService } from './window/icons/icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'text-editor';

  events = Events
  constructor(private dock: DockService, private icons: IconService) {
  }

  ngAfterViewInit() {
    const fn1 = ()=> {
      console.log(1)
    }
    const fn2 = ()=> {
      console.log(2)
    }
    const fn3 = ()=> {
      console.log(3)
    }
    this.dock.addDockItem(this.icons.get('folder'), fn1)
    this.dock.addDockItem(this.icons.get('bookmark1'), fn2)
    this.dock.addDockItem(this.icons.get('bookmark2'), fn3)
  }

}
