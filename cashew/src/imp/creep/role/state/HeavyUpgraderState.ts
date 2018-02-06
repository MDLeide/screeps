import { RoleState } from "../../../../lib/creep/role/state/RoleState"
import { IHeavyUpgraderState } from "./IHeavyUpgraderState";

export class HeavyUpgraderState extends RoleState implements IHeavyUpgraderState {
    phase: number = 0;
    controllerId: string;
    containerId: string;    
}