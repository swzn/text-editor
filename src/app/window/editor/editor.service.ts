import { Injectable } from '@angular/core';
import { EditorComponent } from './editor.component';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  data: any

  component: EditorComponent;

  constructor() { }

  setData(data: any) {
    this.component.content = data;
    console.log('data has been set')
  }

}
