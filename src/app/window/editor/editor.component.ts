import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/filesystem/models/filenode.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  tabs: Set<FileNode> 

  constructor(private editorService: EditorService) {
    this.tabs = new Set<FileNode>
  }

  @Input('ngModel')
  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
  }

}
