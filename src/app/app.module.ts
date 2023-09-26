import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
import { ColorPickerComponent } from './window/themes/color-picker/color-picker.component';
import { DockComponent } from './window/dock/dock.component';
import { DockService } from './window/dock/dock.service';

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
    DockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    IpcService,
    EditorService,
    MenuService,
    DockService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
