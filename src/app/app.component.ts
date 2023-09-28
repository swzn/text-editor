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
    const test = ()=> {
      console.log('test')
    }
    this.dock.addDockItem(this.icons.get('folder'), test)
  }
  

}
