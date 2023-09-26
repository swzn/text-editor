import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconService } from '../icons/icon.service';
import { Icon } from 'src/app/types/icon.type';
import { Events } from 'src/app/types/events.type';
import { DockService } from './dock.service';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.css']
})
export class DockComponent implements OnInit {
  
  @Input({required: true})
  template: {
    icon: string,
    event?: Events,
  }[]

  items: {
    icon: Icon
    event?: Events
  }[] = []
  constructor(
    private icons: IconService,
    private dock: DockService
    ){

  }

  ngOnInit(){
    for(const menuItem of this.template) {
      this.items.push({icon: this.icons.get(menuItem.icon), event: menuItem.event})
    }
  }

  handle(event: Events) {
    this.dock.handle(event)
  }


  
}
