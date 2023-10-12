import { Component, HostBinding } from '@angular/core';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { DirectoryNode } from 'src/app/types/directorynode.type';
import { EditorService } from '../editor/editor.service';
import { ThemeColorService } from '../themes/theme-color.service';
import { ThemeColor } from '../themes/theme-color.enum';
import { DockService } from '../dock/dock.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  workingDirectory: DirectoryNode;

  display: string;

  constructor(
    private fileSystem: FileSystemService,
    private dockService: DockService,
    private editor: EditorService,
    private themeColors: ThemeColorService
    ) {
      this.dockService.bindSidebar(this)
  }

  refreshWorkingDirectory() {
    const pwd = this.fileSystem.getWorkingDirectory()
    if(pwd) this.workingDirectory = pwd;
  }

   getWorkingDirectory(): DirectoryNode | null {
    if(this.workingDirectory === undefined || this.workingDirectory === null || !this.workingDirectory) this.refreshWorkingDirectory()
    return this.workingDirectory
  }

  @HostBinding('style.max-width') 
  get maxWidth() {
    return '300px';
  }

  @HostBinding('style.min-width') 
  get minWidth() {
    return '300px';
  }

  @HostBinding('style.display') 
  get displayToggled() {
    return this.display
  }

  toggle() {
    this.display = this.display === "none" ? this.display = "block" : "none";
  }

}
