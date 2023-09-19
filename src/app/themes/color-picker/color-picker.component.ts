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

  colorGradientHue: string = '#0000ff'

  private mouseheld: boolean = false


  @Input()
  pickerToggled: boolean

  @ViewChild('picker') picker: ElementRef;

  @ViewChild('hue') hue: ElementRef;



  openPicker() {
    this.pickerToggled = true
  }

  mouseupSliderColor() {
    this.mouseheld = false;
  }

  mousedownSliderColor() {
    this.mouseheld = true;
  }


  private updatePicker() {
    let context: CanvasRenderingContext2D = this.picker.nativeElement.getContext('2d')
    let lightGradient: CanvasGradient = context.createLinearGradient(0,0,0, 300)
    lightGradient.addColorStop(0, '#00000000')
    lightGradient.addColorStop(1, '#000')

    let hueGradient: CanvasGradient = context.createLinearGradient(0,0,context.canvas.width,0)
    hueGradient.addColorStop(0, '#fff')
    hueGradient.addColorStop(1, this.colorGradientHue)

    context.fillStyle = hueGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)

    context.fillStyle = lightGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)
  }

  ngAfterViewInit(): void {

    this.updatePicker()

    let slider: CanvasRenderingContext2D = this.hue.nativeElement.getContext('2d')
    let sliderGradient: CanvasGradient = slider.createLinearGradient(0,0, slider.canvas.width, 0)
    sliderGradient.addColorStop(0, '#ff0000')
    sliderGradient.addColorStop(0.25, '#ffff00')
    sliderGradient.addColorStop(0.5, '#00ff00')
    sliderGradient.addColorStop(0.75, '#00ffff')
    sliderGradient.addColorStop(1, '#0000ff')
    slider.fillStyle = sliderGradient
    slider.fillRect(0,0,slider.canvas.width, slider.canvas.height)
  }

  setSliderColor(e: MouseEvent) {
    if(!this.mouseheld) return
    const rect: DOMRect = this.hue.nativeElement.getBoundingClientRect()
    const colorX = e.clientX - rect.left
    const colorY = e.clientY - rect.top

    const buffer: ImageData = this.hue.nativeElement.getContext('2d').getImageData(colorX, colorY, 1, 1);
    this.colorGradientHue = this.bufferToHex(buffer)
    this.updatePicker()
  }
  
  private colorToHex(color: number) {
    const hex = color.toString(16)
    return hex.length == 1 ? "0" + hex : hex
  }

  private bufferToHex(buffer: ImageData) {
    return "#" + this.colorToHex(buffer.data[0]) + this.colorToHex(buffer.data[1]) + this.colorToHex(buffer.data[2])
  }


}
