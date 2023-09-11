import { Component, HostBinding } from '@angular/core';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { DirectoryNode } from 'src/app/filesystem/models/directorynode.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  workingDirectory: DirectoryNode;

  constructor(private fileSystem: FileSystemService) {
  }

  refreshWorkingDirectory() {
    const pwd = this.fileSystem.getWorkingDirectory()
    if(pwd) this.workingDirectory = pwd;
  }

   getWorkingDirectory(): DirectoryNode | null {
    if(this.workingDirectory === undefined || this.workingDirectory === null || !this.workingDirectory) this.refreshWorkingDirectory()
    return this.workingDirectory
  }

  @HostBinding('style.width') 
  get width() {
    return '300px';
  }

}
