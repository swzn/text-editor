import { Component, HostListener, Input } from '@angular/core';
import { FileNode } from '../../../types/filenode.type';
import { EditorService } from '../../editor/editor.service';

@Component({
  selector: 'app-sidebar-file',
  templateUrl: './sidebar-file.component.html',
  styleUrls: ['./sidebar-file.component.css']
})
export class SidebarFileComponent {
 
  constructor(
    private editor: EditorService
    ) {}

  @Input()
  file: FileNode

  getTabs():string {
    return this.file.depth + "em";
  }

  @HostListener('click')
  async requestFile() {
    this.editor.setData(this.file);
  }
  
}
