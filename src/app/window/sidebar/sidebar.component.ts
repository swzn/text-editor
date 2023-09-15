import { Component, HostBinding } from '@angular/core';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { DirectoryNode } from 'src/app/filesystem/models/directorynode.model';
import { EditorService } from '../editor/editor.service';
import { ColorPickerService } from 'src/app/themes/color-picker/color-picker.service';

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
    private colorPicker: ColorPickerService
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

  @HostBinding('style.width') 
  get width() {
    return '300px';
  }

}
