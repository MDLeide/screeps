import { IRoleState } from "../../../../lib/creep/role/state/IRoleState"

export interface ITransporterState extends IRoleState {
    phase: number;
}