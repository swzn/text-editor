import { Component, Input } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/types/filenode.type';
import { TabElement } from '../../types/tabelement.type';
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
    private hash: HashService
    )
    {
    this.tabs = new Set<FileNode>
    this.tabElements = {}
    this.editorService.component = this;
  }

  @Input('ngModel')
  content: string

  original: any

  tabs: Set<FileNode>

  tabElements: {[path: string]: TabElement}

  focusedTab: string | undefined

  async setFocus(file: FileNode) {
    this.unfocusCurrentTab()
    this.resetActiveTab()
    
    const fileContents = await this.editorService.getFileContents(file.path)
    this.content = fileContents
    this.removeCarriageReturn()
    this.focusedTab = file.path
    this.tabElements[file.path].element?.classList.add("active")
    this.hash.sha1(this.content, (fileHash) =>{  this.tabElements[file.path].originalHash = fileHash})
  }

  async unfocusCurrentTab() {
    const currentTab = this.focusedTab

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

  checkChange() {
    const currentPath = this.focusedTab
    const snapshot = this.content
    this.hash.sha1(snapshot, 
        (fileHash) => {
          if(!currentPath || !this.tabElements[currentPath]) return
          this.tabElements[currentPath].edited = (fileHash === this.tabElements[currentPath].originalHash) ? "" : "modified"
          this.editorService.saveTempFile(this.tabElements[currentPath].id, snapshot)
        }
      )
  }

  getTabTitle(filePath: string) {
    if(!this.tabElements[filePath].edited) return filePath
    return filePath + " - Modified"
  }

  removeCarriageReturn() {
    this.content = this.content.replace(/\r/gm,'');
  }

}
