import { ActionType } from "./ActionType";
import { ActionResult } from "./ActionResult";

/** Used to convey information about the result of a Creep <Action> */
export interface IActionResponse {
    type: ActionType;
    result: ActionResult;
}
