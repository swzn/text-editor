import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class HashService {


    private encoder: TextEncoder;
    constructor() {
        this.encoder = new TextEncoder()
    }

    async sha1(value:string, callback: (e: string) => void) {
        let encoded = this.encoder.encode(value)
        window.crypto.subtle.digest("SHA-1", encoded).then(
            (buffer) => {
                let hash = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2,"0")).join("")
                callback(hash)
            }
        )
    }

}