import { LineElementType } from "./lineelementtype.enum";

export class LineElement {

    type: LineElementType
    value: string
    options?: {
        bracketStack: number
    }

    constructor(type: LineElementType, value: string, options?: {
        bracketStack: number
    }) {
        this.value = value
        this.type = type
        this.options = options
    }

}