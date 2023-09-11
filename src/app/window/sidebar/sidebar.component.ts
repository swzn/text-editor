import { AfterViewInit, Component, ElementRef, HostBinding } from '@angular/core';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private fileSystem: FileSystemService) {

  }

  getWorkingDirectory() {
    let a = this.fileSystem.getWorkingDirectory()
    console.log('now logging a')
    console.log(a)
  }

  @HostBinding('style.width') 
  get getWidth() {
    return '300px';
  }

}
