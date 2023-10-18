import { Component, ElementRef, ViewChild } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/types/filenode.type';
import { TabElement } from '../../types/tabelement.type';
import { HashService } from 'src/app/filesystem/hash.service';
import { ASTNode } from 'src/app/types/astnode.type';
import { LineElement } from 'src/app/types/lineelement.type';
import { LineElementType } from 'src/app/types/lineelementtype.enum';
import { TypeScriptLexer } from 'src/app/lexer/typescript/typescript.lexer';
import { Lexer } from 'src/app/lexer/lexer';

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
    this.lexer = new TypeScriptLexer();
  }


  original: any

  tabs: Set<FileNode>

  lines: string[]

  lineElements: LineElement[][]

  root: ASTNode

  tabElements: {[path: string]: TabElement}

  focusedTab: string | undefined

  cursor: {
    element: HTMLElement,
    offset: number,
    row: number
    col: number
  }
  
  private lexer: TypeScriptLexer;

  private dirty: boolean = false;
  

  @ViewChild('linesRef') linesContent: ElementRef;

  

  async setFocus(file: FileNode) {
    this.unfocusCurrentTab()
    this.resetActiveTab()
  
    const fileContents = await this.editorService.getFileContents(file.path)
    this.buildASTFromContent(fileContents)
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

  checkChange(event: Event, lineNumber: number) {
    const element = this.getSelectedElement()
    if(!element) return
    // if((event as InputEvent).inputType === "deleteContentBackward") return
    const anchorOffset = window.getSelection()!.anchorOffset
    const col = this.getColumnFromElementOffset(element, anchorOffset)
    
    //this.buildASTFromContent(this.buildStringFromLines())
    this.dirty = false;
    const setCursor = () => {
      if(!this.dirty) {
        const range = document.createRange()
        const sel = window.getSelection()
        const val = this.findColumnInLine(lineNumber, col)
        range.setStart(val.element.childNodes[0], val.offset)
        range.collapse(true)

        sel!.removeAllRanges()
        sel!.addRange(range)
      }
      else {
        setTimeout(() => setCursor(), 5)
      }
    }

    setTimeout(() => setCursor(), 5)

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
      return element.type + '-' + element.options!.bracketStack % 4 + '-element'
    }
    return element.type + '-element'
  }

  handleClick(event: MouseEvent, lineNumber: number) {
    const tryToPlaceCursor = (attempt: number) => {
      if(attempt >= 5) return
      if(this.getLine(lineNumber).children.length === 1) {
        this.setCursor(this.getLine(lineNumber).children[0] as HTMLElement, 0)
      }
      else {
        setTimeout(() => tryToPlaceCursor(attempt+1), 10)
      }
    }
    if(this.getSelectedElement() === this.getLine(lineNumber)) {
      if(this.getLine(lineNumber).children.length === 0) {
        this.lineElements[lineNumber].push(new LineElement(LineElementType.DEFAULT, ""))
      }
      tryToPlaceCursor(0)
    }
  }

  handleKeydown(event: KeyboardEvent, lineNumber: number) {
    const element = this.getSelectedElement()
    if(!element) return;
    if(this.isArrowKey(event.code)) {
      event.preventDefault()
      this.handleArrowKey(event.code, lineNumber, element)
      return
    }

    if(event.code === "Backspace") {
      if(element.innerText.length <= 1) {
        if(this.getLine(lineNumber) != element) {
          this.getLine(lineNumber).removeChild(element)
          if(element.previousElementSibling) {
            const previousElementSibling = element.previousElementSibling as HTMLElement
            this.setCursor(previousElementSibling, previousElementSibling.innerText.length);
          }
          if(this.getLine(lineNumber).children.length === 0) {
            this.lineElements.splice(lineNumber, 1)
            if(lineNumber != 0) this.setCursor(this.getLine(lineNumber-1).children[0] as HTMLElement, 0)
          }
        }
        else {
          this.lineElements.splice(lineNumber, 1)
          if(lineNumber != 0) this.setCursor(this.getLine(lineNumber-1).children[0] as HTMLElement, 0)
        }
      }
    }

    if(event.code === "Enter") {
      event.preventDefault()
      this.lineElements.splice(lineNumber+1, 0, [new LineElement(LineElementType.DEFAULT, "")])
      const tryPlaceCursor = (attempt:number) => {
        if(attempt >= 5) return;
        if(this.getLine(lineNumber+1)) {
          this.setCursor(this.getLine(lineNumber+1).children[0] as HTMLElement, 0)
        }
        else {
          setTimeout(() => tryPlaceCursor(attempt+1), 10)
        }
      }
      setTimeout(()=> tryPlaceCursor(0), 10)
    }
    
    if(this.getSelectedElement() != this.getLine(lineNumber)) {
      this.cursor = this.getCursor(lineNumber)
    }

    if(this.getSelectedElement() === this.getLine(lineNumber)) {
      event.preventDefault()
      const val = this.findColumnInLine(this.cursor.row, this.cursor.col)
      this.setCursor(val.element, val.offset)
      this.cursor = this.getCursor(this.cursor.row)
    }
  }

  isArrowKey(code: string): boolean {
    return code === "ArrowUp" || code === "ArrowLeft" || code === "ArrowRight" || code === "ArrowDown"   
  }

  handleArrowKey(code: string, lineNumber: number, element: HTMLElement) {
    let verticalOffset = lineNumber;
    let horizontalOffset = window.getSelection()?.anchorOffset || 0;
    let elementContainingCursor: HTMLElement = element;

    if(code === "ArrowRight") {
      horizontalOffset++;  
    }
    else if(code === "ArrowLeft") {
      horizontalOffset--;  
    }
    else if(code === "ArrowUp") {
      verticalOffset--;
    }
    else if(code === "ArrowDown") {
      verticalOffset++;
    }

    if(horizontalOffset < 0) {
      elementContainingCursor = element.previousElementSibling as HTMLElement
      if(elementContainingCursor) horizontalOffset = Math.max(0, elementContainingCursor.innerText.length - 1)
      else {
        if(lineNumber - 1 >= 0) {
          elementContainingCursor = this.getLine(lineNumber-1).children[this.getLine(lineNumber-1).children.length - 1] as HTMLElement
          horizontalOffset = elementContainingCursor.innerText.length
        }
        if(!elementContainingCursor) return
      }
    }
    else if (horizontalOffset > element.innerText.length) {
      elementContainingCursor = element.nextElementSibling as HTMLElement
      if (elementContainingCursor) horizontalOffset = Math.min(elementContainingCursor.innerText.length, 1)
      else {
        if(lineNumber + 1 < this.getLines().length) {
          elementContainingCursor = this.getLine(lineNumber+1).children[0] as HTMLElement
          horizontalOffset = 0
        }
        if(!elementContainingCursor) return
      }
    }
    
    if(Math.min(Math.max(verticalOffset, 0), this.linesContent.nativeElement.children.length) != lineNumber) {
      const col = this.getColumnFromElementOffset(element, horizontalOffset)
      const value = this.findColumnInLine(verticalOffset, col)
      elementContainingCursor = value.element
      horizontalOffset = value.offset
    }

    this.setCursor(elementContainingCursor, horizontalOffset)
    
  }

  getColumnFromElementOffset(element: HTMLElement, offset: number): number {
    let count = offset;
    let currentElement = element.previousElementSibling as HTMLElement
    while(currentElement) {
      count += currentElement.innerText.length
      currentElement = currentElement.previousElementSibling as HTMLElement
    }
    return count;
  }

  findColumnInLine(lineNumber: number, col: number): { element: HTMLElement, offset: number } {
    let count = 0
    const line = this.getLine(lineNumber);
    const value = { element: line.children[0] as HTMLElement, offset: 0 }
    for(let i = 0; i < line.children.length; i++) {
      const element = (line.children[i] as HTMLElement)
      if(element.innerText.length + count <= col) {
        count += element.innerText.length
      }
      else {
        value.element = element;
        value.offset = col - count
        return value
      }
    }
    value.element = line.children[line.children.length - 1] as HTMLElement
    value.offset = value.element.innerText.length
    return value
  }

  setCursor(element: HTMLElement, offset:number) {
    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(element!.childNodes[0] || element, offset)
    range.collapse(true)

    sel!.removeAllRanges()
    sel!.addRange(range)
  }

  getCursor(lineNumber: number) {
    const sel = window.getSelection()
    const col = this.getColumnFromElementOffset(sel?.anchorNode as HTMLElement, sel?.anchorOffset!)
    const row = lineNumber
    return {
      element: sel?.anchorNode! as HTMLElement, offset: sel?.anchorOffset!, row: row, col: col
    }
  }

  getLines(): HTMLElement[] {
    return this.linesContent.nativeElement.children;
  }

  getLine(index: number) {
    return this.getLines()[index] as HTMLElement;
  }

  getSelectedElement() {
    let node = window.getSelection()?.anchorNode
    if(node?.nodeType === Node.TEXT_NODE) node = node.parentElement
    return node as HTMLElement
  }

  buildStringFromLines() {
    let lines: string[] = []
    for (let line of this.getLines()) {
      lines.push(this.removeCarriageReturn(line.innerText).replaceAll('\n', ''))
    }
    return lines.join('\r\n')
  }

  buildASTFromContent(content: string) {
    let lexed = this.lexer.generateAST(this.removeCarriageReturn(content))
    this.root = lexed.root
    this.lines = lexed.lines
    if(!this.lineElements) this.lineElements = lexed.lineElements
    else {
      for (let i = 0; i < lexed.lineElements.length; i++) {
        if(i < this.lineElements.length) {
          this.lineElements[i].splice(0, this.lineElements[i].length)
          for(let element of lexed.lineElements[i]) {
            this.lineElements[i].push(element)
          }
        }
        else {
          this.lineElements.push(lexed.lineElements[i])
        }
      }
      if(this.lineElements.length > lexed.lineElements.length) {
        this.lineElements.splice(lexed.lineElements.length, this.lineElements.length - lexed.lineElements.length)
      }
    }
    
  }

  cleanFlag() {
    if(this.dirty) {
      this.dirty = false
    }
  }
}
