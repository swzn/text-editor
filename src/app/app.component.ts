import { Component } from '@angular/core';
import { EnvironmentService } from './filesystem/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'text-editor';

}
