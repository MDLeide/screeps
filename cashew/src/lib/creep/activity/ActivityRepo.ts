import { IActivityState } from "./state/IActivityState";
import { Activity } from "./Activity";

export class ActivityRepo {
    private static _loadFuncs: { [activityId: string]: (state: IActivityState) => Activity } = {};
    
    public static RegisterActivity(activityId: string, loadFunc: (state: IActivityState) => Activity) {
        this._loadFuncs[activityId] = loadFunc;
    }

    public static LoadFromState(state: IActivityState): Activity {
        if (!state) {
            throw Error("Cannot load activity from null state.");
        }

        var func = this._loadFuncs[state.id];

        if (!func) {
            throw Error("Cannot load activity for id: " + state.id);
        }

        return this._loadFuncs[state.id](state);
    }
}
