import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorService } from './editor.service';
import { SidebarFileComponent } from '../sidebar/sidebar-file/sidebar-file.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {

  tabs: Set<SidebarFileComponent> 

  constructor(private editorService: EditorService) {
    this.tabs = new Set<SidebarFileComponent>
  }

  @Input('ngModel')
  content: any

  ngAfterViewInit() {
    this.editorService.component = this;
  }

  setFocus(file: SidebarFileComponent) {
    file.requestFile()
  }

}
