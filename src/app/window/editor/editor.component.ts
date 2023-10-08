import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/types/filenode.type';
import { TabElement } from '../../types/tabelement.type';
import { HashService } from 'src/app/filesystem/hash.service';
import { Lexer } from './lexer.service';
import { ASTNode } from 'src/app/types/astnode.type';
import { LineElement } from 'src/app/types/lineelement.type';
import { LineElementType } from 'src/app/types/lineelementtype.enum';

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

  original: any

  tabs: Set<FileNode>

  lines: string[]

  lineElements: LineElement[][]

  root: ASTNode

  tabElements: {[path: string]: TabElement}

  focusedTab: string | undefined
  
  @Output() lineChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('linesRef') linesContent: ElementRef;


  async setFocus(file: FileNode) {
    this.unfocusCurrentTab()
    this.resetActiveTab()
  
    const fileContents = await this.editorService.getFileContents(file.path)
    let l = new Lexer()
    let lexed = l.tokenize(this.removeCarriageReturn(fileContents))
    this.root = lexed.root
    this.lines = lexed.lines
    this.lineElements = lexed.lineElements
    this.focusedTab = file.path
    this.tabElements[file.path].element?.classList.add("active")
    this.hash.sha1(this.lineElements.map(line => line.map(e => e.value.replaceAll('\r', '').replaceAll('\n', '')).join('')).join('\r\n'), (fileHash) =>{  this.tabElements[file.path].originalHash = fileHash})
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

  checkChange(event: any, element?: HTMLSpanElement) {
    const anchorOffset = window.getSelection()!.anchorOffset
    if(anchorOffset < 2) console.log(anchorOffset)
    if(element) event.value = element.innerText 

    const setCursor = () => {
      const range = document.createRange()
      const sel = window.getSelection()
      range.setStart(element!.childNodes[0], anchorOffset)
      range.collapse(true)

      sel!.removeAllRanges()
      sel!.addRange(range)
    }
    setTimeout(setCursor)
    const currentPath = this.focusedTab
    let lines = this.lineElements.map(line => line.map(e => e.value.replaceAll('\r', '').replaceAll('\n', '')).join(''))
    const snapshot = lines.join("\r\n")
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

  removeCarriageReturn(content: string) {
    return content.replace(/\r/gm,'');
  }

  getClass(element: LineElement) {
    if(element.type === LineElementType.BRACKET) {
      return element.type + '-' +element.options!.bracketStack % 4 + '-element'
    }
    return element.type + '-element'
  }

}
