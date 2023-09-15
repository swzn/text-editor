import { EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {

  constructor() { }

  openColorPicker(ref: HTMLElement) {
  }
}
