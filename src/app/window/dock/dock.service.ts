import { Injectable } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Events } from "src/app/types/events.type";


@Injectable({
    providedIn: "root"
})
export class DockService {

    sidebar: SidebarComponent

    toggleSidebar() {
        this.sidebar.toggle()
    }

    bindSidebar(sidebar: SidebarComponent) {
        this.sidebar = sidebar
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