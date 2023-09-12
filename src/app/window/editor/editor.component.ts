import { AfterViewInit, Component } from '@angular/core';
import { EditorService } from './editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  constructor(private editorService: EditorService) {}

  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
    console.log('service has been set')
  }

}
