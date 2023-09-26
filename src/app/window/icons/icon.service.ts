import { Injectable } from "@angular/core";
import icons from '../../../assets/icons.json';
import { Icon } from "src/app/types/icon.type";

@Injectable({
    providedIn: "root"
})
export class IconService {
    icons: Icon[]
    constructor(){
        this.icons = icons.data
    }

    

    get(icon: string) {
        const value = this.icons.find(i => i.id === icon)
        return value? value : this.icons[0]
    }
}