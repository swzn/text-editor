import { Component } from '@angular/core';
import dockData from '../../../assets/dock.json';
import { DockIcon } from 'src/app/types/dockicon.type';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.css']
})
export class DockComponent {
  icons: DockIcon[]
  constructor(){
      this.icons = dockData.data
    }
}
