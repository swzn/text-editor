import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './window/sidebar/sidebar.component';
import { IpcService } from './ipc/ipc.service';
import { SidebarFileComponent } from './window/sidebar/sidebar-file/sidebar-file.component';
import { SidebarDirectoryComponent } from './window/sidebar/sidebar-directory/sidebar-directory.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarFileComponent,
    SidebarDirectoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    IpcService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
