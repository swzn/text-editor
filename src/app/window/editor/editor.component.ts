import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/types/filenode.type';
import { TabElement } from '../../types/tabelement.type';
import { FileSystemService } from 'src/app/filesystem/filesystem.service';
import { HashService } from 'src/app/filesystem/hash.service';

const MAX_ATTEMPT = 10;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {


  constructor(
    private editorService: EditorService,
    private fileSystem: FileSystemService,
    private hash: HashService
    )
    {
    this.tabs = new Set<FileNode>
    this.tabElements = {}
    this.editorService.component = this;
  }

  @Input('ngModel')
  content: any

  tabs: Set<FileNode>

  tabElements: {[path: string]: TabElement}

  focusedTab: string | undefined

  async setFocus(file: FileNode) {
    this.resetActiveTab()
    this.content = await this.fileSystem.getFileContents(file.path)
    this.focusedTab = file.path
    this.tabElements[file.path].element?.classList.add("active")
  }

  resetActiveTab() {
    if(!this.focusedTab) return
    this.tabElements[this.focusedTab].element?.classList.remove("active")
  }

  getTab(file: FileNode): TabElement | undefined {
    if(this.tabs.has(file)) return this.tabElements[file.path]
    return undefined
  }

  addTab(file: FileNode, focus: boolean = true) {
    this.tabElements[file.path] = new TabElement(file)
    this.tabs.add(file)
    setTimeout(() => this.bindTab(file, focus, 0), 10)
  }

  removeTab(file: FileNode) {
    this.tabElements[file.path].element?.remove()
    this.tabs.delete(file)
  }

  private bindTab(file: FileNode, focus: boolean, attempt: number) {
    if(attempt > MAX_ATTEMPT) throw new Error("Unable to bind to new tab")
    const tabElement = document.getElementById(file.path)
    if(tabElement) {
      this.tabElements[file.path].element = tabElement
      this.setFocus(file)
    }
    else {
      setTimeout(() => this.bindTab(file, focus, attempt + 1), 10 * attempt + 1)
    }
  }

  checkChange(event: any) {
    this.hash.sha1(this.content, 
        (fileHash) => (
          console.log(fileHash)
        )
      )
  }



}
