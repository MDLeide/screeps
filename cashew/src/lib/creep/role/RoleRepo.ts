import { IRoleState } from "./state/IRoleState";
import { Role } from "./Role";

export class RoleRepo {
    private static _loadFuncs: { [roleId: string]: (state: IRoleState) => Role } = {};
    private static _newFuncs: { [roleId: string]: (creep: Creep) => Role } = {};

    public static RegisterRole(roleId: string, loadFunc: (state: IRoleState) => Role) {
        this._loadFuncs[roleId] = loadFunc;
    }

    public static RegisterRoleNew(roleId: string, newFunc: (creep: Creep) => Role) {
        this._newFuncs[roleId] = newFunc;
    }

    public static GetNew(roleId: string, creep: Creep): Role {
        var func = this._newFuncs[roleId];
        if (!func) {
            throw new Error("Could not find create new function for role id: " + roleId);
        }

        return func(creep);
    }

    public static LoadFromState(state: IRoleState): Role {
        if (!state) {
            throw new Error("Cannot load from null state");
        }

        var func = this._loadFuncs[state.id];

        if (!func) {
            throw new Error("Could not fund load function for role id: " + state.id);
        }

        return func(state);
    }
}
