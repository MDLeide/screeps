import { IRoleState } from "../../../../lib/creep/role/state/IRoleState"

export interface IHeavyUpgraderState extends IRoleState {
    phase: number;
    controllerId: string;
    containerId: string;
}
