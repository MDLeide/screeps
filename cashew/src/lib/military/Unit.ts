import { Formation, FormationPosition, FormationMoveResult, FormationState } from "./Formation";

export class Unit {
    public creeps: { [name: string]: Creep } = {};
    public formation: Formation;
    public get capacity(): number {
        return this.formation.positions.length + 1;
    }
    public get enlisted(): number {
        return _.sum(this.formation.positions, p => p.creep ? 1 : 0) + (this.formation.vanguard.creep ? 1 : 0);
    }
    public get openPositions(): number {
        return _.sum(this.formation.positions, p => p.creep ? 0 : 1) + (this.formation.vanguard.creep ? 0 : 1);
    }

    public move(direction: DirectionConstant): FormationMoveResult {
        return this.formation.move(direction);
    }

    public moveTo(pos: RoomPosition | { pos: RoomPosition }): FormationMoveResult {
        return this.formation.moveTo(pos);
    }
}


