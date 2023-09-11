import { Component, Input } from '@angular/core';
import { FileNode } from '../../../filesystem/models/filenode.model';

@Component({
  selector: 'app-sidebar-file',
  templateUrl: './sidebar-file.component.html',
  styleUrls: ['./sidebar-file.component.css']
})
export class SidebarFileComponent {
 
  @Input()
  file: FileNode


  getTabs():string {
    return this.file.depth + "em";
  }
  
}
