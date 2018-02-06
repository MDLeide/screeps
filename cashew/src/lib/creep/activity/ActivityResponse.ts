import { ActivityResult } from "./ActivityResult";
import { ActivityStatus } from "./ActivityStatus";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class ActivityResponse {

    private _result: ActivityResult;
    private _status: ActivityStatus;
    private _errorContext: any;
    private _actionsTaken: IActionResponse[];

    constructor(result: ActivityResult, status: ActivityStatus, errorContext?: any, actionsTaken?: IActionResponse[]) {
        this._result = result;
        this._status = status;
        this._errorContext = errorContext;
        if (actionsTaken) {
            this._actionsTaken = actionsTaken;
        } else {
            this._actionsTaken = [];
        }
    }

    get result(): ActivityResult {
        return this._result;
    }

    get status(): ActivityStatus {
        return this._status;
    }

    get errorContext(): any {
        return this._errorContext;
    }

    get actionsTaken(): IActionResponse[] {
        return this._actionsTaken;
    }

    public toString(): string {
        return '[Result: ' + ActivityResult[this.result] + '] [Status: ' + ActivityStatus[this.status] + ']';
    }
}
