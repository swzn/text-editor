import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorService } from './editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  constructor(private editorService: EditorService) {}

  @Input('ngModel')
  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
    console.log('service has been set')
  }

  printContents() {
    console.log(this.content)
  }

}
