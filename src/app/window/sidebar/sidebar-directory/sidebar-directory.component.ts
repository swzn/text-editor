import { Component, HostListener, Input } from '@angular/core';
import { DirectoryNode } from 'src/app/filesystem/models/directorynode.model';

@Component({
  selector: 'app-sidebar-directory',
  templateUrl: './sidebar-directory.component.html',
  styleUrls: ['./sidebar-directory.component.css']
})

export class SidebarDirectoryComponent {

  @Input()
  directory: DirectoryNode;

  @Input()
  toggled: boolean = false;

  constructor() {
  }

  getTabs():string {
    return this.directory.depth + "em";
  }

  toggleDirectory() {
    this.toggled = !this.toggled;
  }

  getArrow():string {
    return this.toggled ? "↓" : "→";
  }
}
