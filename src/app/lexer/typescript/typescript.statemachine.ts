import { ASTNode } from "src/app/types/astnode.type";
import { LineElement } from "src/app/types/lineelement.type";
import { State } from "src/app/types/state.type";

export class TypeScriptStateMachine {

    parseState(options?: {
        state?: State,
        callback?: Function
    }): {
        run?: Function,
        node?: ASTNode,
        element?: LineElement
    } | undefined
    {
        return undefined
    }

    parseWord() {}

    parseSyntax() {}
}