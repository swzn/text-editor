import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { buffer } from 'rxjs';

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

  private pickerBuffer : ImageData;

  private sliderBuffer : ImageData;

  @Input()
  pickerToggled: boolean

  @ViewChild('picker') picker: ElementRef;

  @ViewChild('slider') slider: ElementRef;



  openPicker() {
    this.pickerToggled = true
  }

  mouseup() {
    this.mouseheld = false;
    console.log(this.colorGradientHue)
    console.log(this.value)
  }

  mousedown(event?: MouseEvent) {
    if(event && event.buttons == 0) return 
    this.mouseheld = true;
  }

  private updatePicker() {

    const context: CanvasRenderingContext2D = this.picker.nativeElement.getContext('2d')
    const buffer = context.createImageData(context.canvas.width, context.canvas.height)
    const grayscale: Lerp = new Lerp(0,context.canvas.height - 1, 0, 255)
    const r = new Lerp(0, context.canvas.width - 1,  255,   parseInt(this.colorGradientHue.substring(1,3), 16))
    const g = new Lerp(0, context.canvas.height - 1, 255, parseInt(this.colorGradientHue.substring(3,5), 16))
    const b = new Lerp(0, context.canvas.height - 1, 255, parseInt(this.colorGradientHue.substring(5,7), 16))

     for(let i = 0; i < context.canvas.width; i++) {
      const rColor = r.eval(i)
      const gColor = g.eval(i)
      const bColor = b.eval(i)
       for(let j = 0; j < context.canvas.height; j++) {
         const basepixel = j * 4 * context.canvas.width + i * 4
         buffer.data[basepixel + 0] = (255 - grayscale.eval(j)) / 255 * (rColor)
         buffer.data[basepixel + 1] = (255 - grayscale.eval(j)) / 255 * (gColor)
         buffer.data[basepixel + 2] = (255 - grayscale.eval(j)) / 255 * (bColor)
         buffer.data[basepixel + 3] = 255
       }
     }
    
    context.putImageData(buffer, 0, 0)

    this.pickerBuffer = buffer;
  }

  ngAfterViewInit(): void {

    this.updatePicker()
    this.updateSlider()

  }

  updateSlider() {
    let slider: CanvasRenderingContext2D = this.slider.nativeElement.getContext('2d')
    let sliderGradient: CanvasGradient = slider.createLinearGradient(1,0, slider.canvas.width-1, 0)
    sliderGradient.addColorStop(0, '#ff0000')
    sliderGradient.addColorStop(0.2, '#ffff00')
    sliderGradient.addColorStop(0.4, '#00ff00')
    sliderGradient.addColorStop(0.6, '#00ffff')
    sliderGradient.addColorStop(0.8, '#0000ff')
    sliderGradient.addColorStop(1, '#ff0000')
    slider.fillStyle = sliderGradient
    slider.fillRect(0,0,slider.canvas.width, slider.canvas.height)
    this.sliderBuffer = slider.getImageData(0,0, slider.canvas.width, slider.canvas.height)
  }

  refreshColor() {
    const context = this.picker.nativeElement.getContext("2d")
    const bufferPosition = this.pickerPosition.y * context.canvas.width * 4 + this.pickerPosition.x * 4
    this.value = this.rgbToHex(this.pickerBuffer.data[bufferPosition], this.pickerBuffer.data[bufferPosition + 1], this.pickerBuffer.data[bufferPosition + 2])
  }

  setSliderColor(e: MouseEvent, click?: boolean) {
    if(!this.mouseheld && !click) return
    const rect: DOMRect = this.slider.nativeElement.getBoundingClientRect()
    const context = this.slider.nativeElement.getContext("2d")
    const colorX = Math.round(Math.max(Math.min(e.clientX - rect.left, rect.width - 1), 0))
    const colorY = Math.round(Math.max(Math.min(e.clientY - rect.top, rect.height - 1), 0))

    this.sliderPosition.setPosition(colorX, colorY)

    context.putImageData(this.sliderBuffer, 0, 0)
    const bufferPosition = this.sliderPosition.y * context.canvas.width * 4 + this.sliderPosition.x * 4
    this.colorGradientHue = this.rgbToHex(this.sliderBuffer.data[bufferPosition], this.sliderBuffer.data[bufferPosition + 1], this.sliderBuffer.data[bufferPosition + 2])
    this.drawCircle(context, this.sliderPosition)
    this.updatePicker()
    this.refreshColor()
  }

  setPickerColor(e: MouseEvent, click?: boolean) {
    if(!this.mouseheld && !click) return
    const rect: DOMRect = this.picker.nativeElement.getBoundingClientRect()
    const context = this.picker.nativeElement.getContext("2d")

    const colorX = Math.round(Math.max(Math.min(e.clientX - rect.left, rect.width - 1), 0))
    const colorY = Math.round(Math.max(Math.min(e.clientY - rect.top, rect.height - 1), 0))

    this.pickerPosition.setPosition(colorX, colorY)
    context.putImageData(this.pickerBuffer, 0, 0)
    this.drawCircle(this.picker.nativeElement.getContext("2d"), this.pickerPosition)

    this.refreshColor()
  }
  
  private colorToHex(color: number) {
    const hex = color.toString(16)
    return hex.length == 1 ? "0" + hex : hex
  }

  private rgbToHex(r:number, g:number, b:number) {
    return "#" + this.colorToHex(r) + this.colorToHex(g) + this.colorToHex(b)
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
