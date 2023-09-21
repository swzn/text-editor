import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

const CIRCLE_RADIUS: number = 4
const STROKE_WIDTH: number = 2
class Position {

  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setPosition(x: number, y: number) {
    this.x = Math.round(x)
    this.y = Math.round(y)
  }
}

class Lerp {

  private start:number
  private end:number
  private lerpStart:number
  private lerpEnd:number
  private boundValues: boolean = false

  constructor(start:number, end:number, lerpStart:number, lerpEnd:number, boundValues?: boolean) {
    this.start = start
    this.end = end
    this.lerpStart = lerpStart
    this.lerpEnd = lerpEnd
    if(boundValues) this.boundValues = boundValues;
  }

  eval(value: number): number {
    let result = (value-this.start) / (this.end - this.start) * (this.lerpEnd - this.lerpStart) + this.lerpStart
    if(this.boundValues) result = Math.max(Math.min(value, this.lerpEnd), this.lerpStart)
    return result
  }

}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements AfterViewInit {


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

  private colorGradientHue: string = '#0000ff'

  private mouseheld: boolean = false

  private sliderPosition: Position = new Position(0,0)

  private pickerPosition: Position = new Position(0,0)

  @Input()
  pickerToggled: boolean

  @ViewChild('picker') picker: ElementRef;

  @ViewChild('slider') slider: ElementRef;



  openPicker() {
    this.pickerToggled = true
  }

  mouseup() {
    this.mouseheld = false;
  }

  mousedown(event?: MouseEvent) {
    if(event && event.buttons == 0) return 
    this.mouseheld = true;
  }


  private updatePicker() {
    let context: CanvasRenderingContext2D = this.picker.nativeElement.getContext('2d')
    let lightGradient: CanvasGradient = context.createLinearGradient(0,0,0, context.canvas.height)
    lightGradient.addColorStop(0, '#00000000')
    lightGradient.addColorStop(1, '#000000')

    let hueGradient: CanvasGradient = context.createLinearGradient(0,0,context.canvas.width,0)
    hueGradient.addColorStop(0, '#fff')
    hueGradient.addColorStop(1, this.colorGradientHue)

    context.fillStyle = hueGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)

    context.fillStyle = lightGradient;
    context.fillRect(0,0 , context.canvas.width, context.canvas.height)

    this.drawCircle(context, this.pickerPosition)
  }

  ngAfterViewInit(): void {

    this.updatePicker()
    this.updateSlider()

  }

  updateSlider() {
    let slider: CanvasRenderingContext2D = this.slider.nativeElement.getContext('2d')
    let sliderGradient: CanvasGradient = slider.createLinearGradient(0,0, slider.canvas.width, 0)
    sliderGradient.addColorStop(0, '#ff0000')
    sliderGradient.addColorStop(0.25, '#ffff00')
    sliderGradient.addColorStop(0.5, '#00ff00')
    sliderGradient.addColorStop(0.75, '#00ffff')
    sliderGradient.addColorStop(1, '#0000ff')
    slider.fillStyle = sliderGradient
    slider.fillRect(0,0,slider.canvas.width, slider.canvas.height)

    this.drawCircle(slider, this.sliderPosition)
  }

  setSliderColor(e: MouseEvent, click?: boolean) {
    if(!this.mouseheld && !click) return
    const rect: DOMRect = this.slider.nativeElement.getBoundingClientRect()
    const colorX = Math.max(Math.min(e.clientX - rect.left, rect.width), 0)
    const colorY = Math.max(Math.min(e.clientY - rect.top, rect.height), 0)

    this.sliderPosition.setPosition(colorX, colorY)


    const buffer: ImageData = this.slider.nativeElement.getContext('2d').getImageData(this.sliderPosition.x, this.sliderPosition.y, 1, 1);
    this.colorGradientHue = this.bufferToHex(buffer)
    this.updatePicker()
    this.updateSlider()
  }

  setPickerColor(e: MouseEvent, click?: boolean) {
    if(!this.mouseheld && !click) return
    const rect: DOMRect = this.picker.nativeElement.getBoundingClientRect()

    const colorX = Math.max(Math.min(e.clientX - rect.left, rect.width), 0)
    const colorY = Math.max(Math.min(e.clientY - rect.top, rect.height), 0)


    this.pickerPosition.setPosition(colorX, colorY)

    const buffer: ImageData = this.picker.nativeElement.getContext('2d').getImageData(this.pickerPosition.x, this.pickerPosition.y, 1, 1);
    this.value = this.bufferToHex(buffer)
    if(this.value === "#ffffff") {
      console.log(buffer)
      console.log(this.pickerPosition.x + " " + this.pickerPosition.y)
      console.log(this.value)
    }
    this.updatePicker()
    this.updateSlider()

  }
  
  private colorToHex(color: number) {
    const hex = color.toString(16)
    return hex.length == 1 ? "0" + hex : hex
  }

  private bufferToHex(buffer: ImageData) {
    return "#" + this.colorToHex(buffer.data[0]) + this.colorToHex(buffer.data[1]) + this.colorToHex(buffer.data[2])
  }

  private drawCircle(context: CanvasRenderingContext2D, position: Position) {
    context.beginPath()
    const originalWidth: number =  context.lineWidth
    const originalStyle: string | CanvasGradient | CanvasPattern = context.strokeStyle

    context.arc(position.x, position.y, CIRCLE_RADIUS, 0, Math.PI * 2)
    context.lineWidth = STROKE_WIDTH + 2
    context.strokeStyle = "black"
    context.stroke()

    context.arc(position.x, position.y, CIRCLE_RADIUS, 0, Math.PI * 2)
    context.lineWidth = STROKE_WIDTH
    context.strokeStyle = "white"
    context.stroke()


    context.lineWidth = originalWidth
    context.strokeStyle = originalStyle
  }

}
