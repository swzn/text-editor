import { ASTNode } from "../types/astnode.type";
import { LineElement } from "../types/lineelement.type";
import { State } from "../types/state.type";

export interface StateMachine {

    parseState(options?: {
        state?: State,
        callback?: Function
    }): {
        run?: Function,
        node?: ASTNode,
        element?: LineElement
    } | undefined

}