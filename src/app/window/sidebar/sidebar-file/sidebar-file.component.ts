import { Component, HostListener, Input } from '@angular/core';
import { FileNode } from '../../../filesystem/models/filenode.type';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { EditorService } from '../../editor/editor.service';

@Component({
  selector: 'app-sidebar-file',
  templateUrl: './sidebar-file.component.html',
  styleUrls: ['./sidebar-file.component.css']
})
export class SidebarFileComponent {
 
  constructor(
    private fileSystem: FileSystemService,
    private editor: EditorService
    ) {}

  @Input()
  file: FileNode

  getTabs():string {
    return this.file.depth + "em";
  }

  @HostListener('click')
  async requestFile() {
    const fileContents = await this.fileSystem.getFileContents(this.file.path)
    this.editor.setData(fileContents);
    this.editor.addTab(this);
  }
  
}
