import { Component } from '@angular/core';
import { DockService } from './window/dock/dock.service';
import { Events } from './types/events.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'text-editor';

  events = Events
  constructor() {
  }
}
