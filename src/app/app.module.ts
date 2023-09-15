import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './window/sidebar/sidebar.component';
import { IpcService } from './ipc/ipc.service';
import { SidebarFileComponent } from './window/sidebar/sidebar-file/sidebar-file.component';
import { SidebarDirectoryComponent } from './window/sidebar/sidebar-directory/sidebar-directory.component';
import { EditorComponent } from './window/editor/editor.component';
import { TitlebarComponent } from './window/titlebar/titlebar.component';
import { BottombarComponent } from './window/bottombar/bottombar.component';
import { EditorService } from './window/editor/editor.service';
import { FormsModule } from '@angular/forms';
import { MenuService } from './window/titlebar/menu.service';
import { ColorPickerComponent } from './themes/color-picker/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarFileComponent,
    SidebarDirectoryComponent,
    EditorComponent,
    TitlebarComponent,
    BottombarComponent,
    ColorPickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    IpcService,
    EditorService,
    MenuService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
