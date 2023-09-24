import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/types/filenode.type';
import { TabElement } from '../../types/tabelement.type';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  tabs: Set<FileNode>
  tabElements: {[path: string]: TabElement}

  constructor(
    private editorService: EditorService,
    private fileSystem: FileSystemService
    )
    {
    this.tabs = new Set<FileNode>
    this.tabElements = {}
  }

  @Input('ngModel')
  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
  }

  async setFocus(file: FileNode) {
    this.content = await this.fileSystem.getFileContents(file.path)
  }

  resetActiveTab() {
    const previousActive = document.getElementById("activeTab")
    if(previousActive) previousActive.id = ""
  }

  getTab(file: FileNode): TabElement | undefined {
    if(this.tabs.has(file)) return this.tabElements[file.path]
    return undefined
  }

  addTab(file: FileNode, focus: boolean = true) {
    this.tabs.add(file)
    this.tabElements[file.path] = new TabElement(file)
    if(focus) this.setFocus(file)
  }

}
