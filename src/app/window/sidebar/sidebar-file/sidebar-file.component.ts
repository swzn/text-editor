import { Component, HostListener, Input } from '@angular/core';
import { FileNode } from '../../../filesystem/models/filenode.model';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';

@Component({
  selector: 'app-sidebar-file',
  templateUrl: './sidebar-file.component.html',
  styleUrls: ['./sidebar-file.component.css']
})
export class SidebarFileComponent {
 
  constructor(private fileSystem: FileSystemService) {}

  @Input()
  file: FileNode


  getTabs():string {
    return this.file.depth + "em";
  }

  @HostListener('click')
  async requestFile() {
    await this.fileSystem.getFileContents(this.file.path)
  }
  
}
