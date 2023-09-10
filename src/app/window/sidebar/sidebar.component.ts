import { AfterViewInit, Component, ElementRef, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {


  @HostBinding('style.width') 
  get getWidth() {
    return '300px';
  }

}
