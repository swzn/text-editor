import { Component, HostBinding } from '@angular/core';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { DirectoryNode } from 'src/app/filesystem/models/directorynode.type';
import { EditorService } from '../editor/editor.service';
import { ThemeColorService } from '../themes/theme-color.service';
import { ThemeColor } from '../themes/theme-color.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  workingDirectory: DirectoryNode;

  constructor(
    private fileSystem: FileSystemService,
    private editor: EditorService,
    private themeColors: ThemeColorService
    ) {
  }

  refreshWorkingDirectory() {
    const pwd = this.fileSystem.getWorkingDirectory()
    if(pwd) this.workingDirectory = pwd;
  }

   getWorkingDirectory(): DirectoryNode | null {
    if(this.workingDirectory === undefined || this.workingDirectory === null || !this.workingDirectory) this.refreshWorkingDirectory()
    return this.workingDirectory
  }

  saveCurrentFile() {
    this.editor.saveFile()
  }

  test() {
    this.themeColors.setColor(ThemeColor.MAIN_BACKGROUND, "#ffffff")
  }

  @HostBinding('style.max-width') 
  get maxWidth() {
    return '300px';
  }

  @HostBinding('style.min-width') 
  get minWidth() {
    return '300px';
  }

}
