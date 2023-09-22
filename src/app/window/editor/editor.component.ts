import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorService } from './editor.service';
import { FileNode } from 'src/app/filesystem/models/filenode.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  tabs: FileNode[]

  constructor(private editorService: EditorService) {}

  @Input('ngModel')
  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
  }

}
