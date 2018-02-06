import { IRoleState } from "./state/IRoleState";
import { Role } from "./Role";

export interface IRoleBuilder {
    LoadFromState(creep: Creep, id: string, state: IRoleState): Role;
    GetNew(creep: Creep, id: string): Role;
}