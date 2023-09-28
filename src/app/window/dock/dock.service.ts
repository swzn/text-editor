import { Injectable } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Events } from "src/app/types/events.type";
import { DockComponent } from "./dock.component";
import { Icon } from "src/app/types/icon.type";


@Injectable({
    providedIn: "root"
})
export class DockService {

    sidebar: SidebarComponent
    dock: DockComponent

    addDockItem(icon: Icon, callback?: Function) {
        this.dock.addItem(icon, callback)
    }

    toggleSidebar() {
        this.sidebar.toggle()
    }

    bindSidebar(sidebar: SidebarComponent) {
        this.sidebar = sidebar
    }

    bindDock(dock: DockComponent) {
        this.dock = dock
    }

    handle(event: Events) {
        switch(event) {
            case Events.TOGGLE_SIDEBAR: {
                this.toggleSidebar()
                break;
            }
        }
    }

}