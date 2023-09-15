import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements AfterViewInit{

  @Input({required: true})
  name: string

  /** 
   * Can be either 'hex', 'hexa', 'rgb', 'rgba' or 'hsv'
   * 
  */
  @Input()
  type: string = 'rgba'

  /** 
   * Can be either 'none', 'left' or 'right'
   * 
  */
  @Input() 
  preview: string = 'left'

  
  value: string = '#ffffff'

  @Input()
  pickerToggled: boolean

  @ViewChild('picker') picker: ElementRef;


  openPicker() {
    console.log('try again')
    this.pickerToggled = true
  }

  ngAfterViewInit(): void {
    let context: CanvasRenderingContext2D = this.picker.nativeElement.getContext('2d')
    let lightGradient: CanvasGradient = context.createLinearGradient(0,0,0, 300)
    lightGradient.addColorStop(0, '#00000000')
    lightGradient.addColorStop(1, '#000')

    let hue = '#0000ff'
    let hueGradient: CanvasGradient = context.createLinearGradient(0,0,context.canvas.width,0)
    hueGradient.addColorStop(0, '#fff')
    hueGradient.addColorStop(1, hue)

    context.fillStyle = hueGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)

    context.fillStyle = lightGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)
  }


}
