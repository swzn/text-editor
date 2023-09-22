import { Injectable } from '@angular/core';
import { ThemeColor } from './theme-color.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeColorService {

  constructor() { 

  }

  setColor(colorAttribute: ThemeColor, value: string) {
    document.documentElement.style.setProperty(colorAttribute, value)
  }

}
