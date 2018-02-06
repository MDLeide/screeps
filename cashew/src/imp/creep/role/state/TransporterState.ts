import { RoleState } from "../../../../lib/creep/role/state/RoleState"
import { ITransporterState } from "./ITransporterState";

export class TransporterState extends RoleState implements ITransporterState {
    phase: number = 0;
}