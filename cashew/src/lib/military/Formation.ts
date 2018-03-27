import { RoomHelper } from "../util/RoomHelper";

export enum FormationMoveResult {
    OK,
    Fatigued, // 1
    AtDestination,
    Stuck, // 3
    NoVanguard
}

export enum FormationState {
    Exact,
    Tight,
    Loose,
    Free,
    Empty,
    Incomplete
}

/**
 * Handles movement and positioning of a group of creeps.
 */
export class Formation {
    public static fromMemory(memory: FormationMemory): Formation {
        return new this(
            FormationPosition.fromMemory(memory.vanguard),
            memory.positions.map(p => FormationPosition.fromMemory(p)),
            memory.type);
    }


    constructor(vanguard: FormationPosition, positions: FormationPosition[], type: FormationType) {
        if (vanguard.x != 0 || vanguard.y != 0) throw new Error("Vanguard position must be {0, 0}.");
        let vanguardFound = false;
        for (var i = 0; i < positions.length; i++) {
            if (positions[i].originalVanguard) {
                vanguardFound = true;
                break;
            }
        }
        if (!vanguardFound)
            vanguard.originalVanguard = true;
        this.vanguard = vanguard;
        this.positions = positions;
        this.type = type;
    }


    public type: FormationType;
    public vanguard: FormationPosition;
    public positions: FormationPosition[];


    public assign(creep: string, positionName: string): FormationPosition {
        if (!this.vanguard.originalVanguard) {
            for (var i = 0; i < this.positions.length; i++) {
                if (this.positions[i].originalVanguard && !this.positions[i].creepName) {
                    if (this.positions[i].name == positionName) {
                        this.positions[i].assign(creep);
                        this.changeVanguard(this.positions[i]);
                        return this.positions[i];
                    } else {
                        break;
                    }
                }
            }
        }

        for (var i = 0; i < this.positions.length; i++) {
            if (!this.positions[i].creepName && this.positions[i].name == positionName) {
                this.positions[i].assign(creep);                
                return this.positions[i];
            }
        }
        return null;
    }

    /** Attempts to move all units to their positions relative to the vanguard. Returns false if any of the moves fail. */
    public formUp(): boolean {
        for (var i = 0; i < this.positions.length; i++) {
            if (!this.positions[i].creep || this.positions[i].creep.spawning)
                continue;

            let pos = this.getRoomPosition(this.positions[i]);
            if (pos.isEqualTo(this.positions[i].creep))
                continue;

            if (this.positions[i].creep.moveTo(pos) != OK) {
                for (var j = 0; j < i; j++)
                    if (this.positions[j].creep && !this.positions[j].creep.spawning)
                        this.positions[j].creep.cancelOrder("moveTo");
                return false;
            }
        }
        return true;
    }

    /** Returns true if the unit can form up given its current vanguard position. */
    public canFormUp(): boolean {
        for (var i = 0; i < this.positions.length; i++) {
            if (!this.positions[i].creep || this.positions[i].creep.spawning)
                continue;

            let pos = this.getRoomPosition(this.positions[i]);
            if (pos.isEqualTo(this.positions[i].creep))
                continue;

            if (!RoomHelper.isWalkable(pos, true))
                return false;
        }
        return true;
    }

    public canMoveTo(pos: RoomPosition | { pos: RoomPosition }): boolean {
        if (!(pos instanceof RoomPosition))
            return this.canMoveTo(pos.pos);

        if (!RoomHelper.isWalkable(pos))
            return false;

        for (var i = 0; i < this.positions.length; i++) {
            let adjPos = RoomHelper.transformRoomPosition(pos, { x: this.positions[i].x, y: this.positions[i].y });
            if (!RoomHelper.isWalkable(adjPos))
                return false;
        }
        return true;
    }

    public moveTo(pos: RoomPosition | { pos: RoomPosition }): FormationMoveResult {
        if (!(pos instanceof RoomPosition))
            return this.moveTo(pos.pos);

        this.checkVanguard();
        if (!this.vanguard.creep || this.vanguard.creep.spawning)
            return FormationMoveResult.NoVanguard;
        if (this.vanguard.creep.pos.isEqualTo(pos))
            return FormationMoveResult.AtDestination;
        if (this.vanguard.creep.fatigue > 0)
            return FormationMoveResult.Fatigued;

        for (var i = 0; i < this.positions.length; i++)
            if (this.positions[i].creep && this.positions[i].creep.fatigue > 0)
                return FormationMoveResult.Fatigued;

        if (this.vanguard.creep.moveTo(pos) != OK)
            return FormationMoveResult.Stuck;

        for (var i = 0; i < this.positions.length; i++) {
            if (this.positions[i].creep && !this.positions[i].creep.spawning) {
                let adjPos = RoomHelper.transformRoomPosition(pos, { x: this.positions[i].x, y: this.positions[i].y });

                if (this.positions[i].creep.moveTo(adjPos) != OK) {
                    this.vanguard.creep.cancelOrder("moveTo");

                    for (var j = 0; j < i; j++)
                        if (this.positions[j].creep && !this.positions[j].creep.spawning)
                            this.positions[j].creep.cancelOrder("moveTo");

                    return FormationMoveResult.Stuck;
                }
            }
        }

        return FormationMoveResult.OK;
    }

    public move(direction: DirectionConstant): FormationMoveResult {
        this.checkVanguard();
        if (!this.vanguard.creep)
            return FormationMoveResult.NoVanguard;
        if (this.vanguard.creep.fatigue > 0)
            return FormationMoveResult.Fatigued;
        if (!this.canMove(direction, this.vanguard))
            return FormationMoveResult.Stuck;

        for (var i = 0; i < this.positions.length; i++) {
            if (this.positions[i].creep && this.positions[i].creep.fatigue > 0)
                return FormationMoveResult.Fatigued;
            if (!this.canMove(direction, this.positions[i]))
                return FormationMoveResult.Stuck;
        }

        if (this.vanguard.creep.move(direction) != OK)
            return FormationMoveResult.Stuck;

        for (var i = 0; i < this.positions.length; i++) {
            if (this.positions[i].creep && !this.positions[i].creep.spawning) {
                if (this.positions[i].creep.move(direction) != OK) {
                    this.vanguard.creep.cancelOrder("move");

                    for (var j = 0; j < i; j++)
                        if (this.positions[j].creep && !this.positions[j].creep.spawning)
                            this.positions[j].creep.cancelOrder("move");

                    return FormationMoveResult.Stuck;
                }
            }
        }

        return FormationMoveResult.OK;
    }

    public canMove(direction: DirectionConstant, position: FormationPosition): boolean {
        if (!position.creep || position.creep.spawning) return true;
        let newPosition = RoomHelper.moveRoomPosition(position.creep.pos, direction);
        return RoomHelper.isWalkable(newPosition);
    }

    public getState(): FormationState {
        this.checkVanguard();
        if (!this.vanguard) return FormationState.Empty;

        let farthest = 0;
        for (var i = 0; i < this.positions.length; i++) {
            if (!this.positions[i].creep)
                return FormationState.Incomplete;

            let dist = this.distanceFromExpectedPosition(this.positions[i]);
            if (dist > farthest)
                farthest = dist;
        }
        if (farthest == 0)
            return FormationState.Exact;
        else if (farthest == 1)
            return FormationState.Tight;
        else if (farthest == 3)
            return FormationState.Loose;
        else
            return FormationState.Free;
    }


    private getRoomPosition(position: FormationPosition): RoomPosition {
        return RoomHelper.transformRoomPosition(this.vanguard.creep.pos, { x: position.x, y: position.y });
    }

    private distanceFromExpectedPosition(position: FormationPosition): number {
        let expected = this.getRoomPosition(position);
        return position.creep.pos.getRangeTo(expected);
    }

    private checkVanguard(): void {
        if (this.vanguard.creep) return;

        if (!this.vanguard.originalVanguard) {
            for (var i = 0; i < this.positions.length; i++) {
                if (this.positions[i].originalVanguard) {
                    if (this.positions[i].creepName) {
                        this.changeVanguard(this.positions[i]);
                        return;
                    } else {
                        break;
                    }
                }
            }
        }

        let nearestDistance = 51;
        let newVanguard: FormationPosition;

        for (var i = 0; i < this.positions.length; i++) {
            if (!this.positions[i].creepName) continue;
            let dist = Math.max(Math.abs(this.vanguard.x - this.positions[i].x), Math.abs(this.vanguard.y - this.positions[i].y));
            if (dist < nearestDistance) {
                nearestDistance = dist;
                newVanguard = this.positions[i];
            }
        }

        if (newVanguard)
            this.changeVanguard(newVanguard);
    }

    private changeVanguard(newVanguard: FormationPosition): void {
        this.positions.splice(this.positions.indexOf(newVanguard), 1);
        this.positions.push(this.vanguard);
        this.vanguard = newVanguard;
        for (var i = 0; i < this.positions.length; i++) {
            this.positions[i].x -= this.vanguard.x;
            this.positions[i].y -= this.vanguard.y;
        }
        this.vanguard.x = 0;
        this.vanguard.y = 0;
    }


    protected getPositionMemory(): FormationPositionMemory[] {
        return this.positions.map(p => p.save());
    }

    public save(): FormationMemory {
        return {
            vanguard: this.vanguard.save(),
            positions: this.getPositionMemory(),
            type: this.type
        }
    }
}

export class FormationPosition {
    public static fromMemory(memory: FormationPositionMemory): FormationPosition {
        let formation = new this(memory.name, memory.x, memory.y);
        if (memory.creep) {
            formation.creep = Game.creeps[memory.creep];
            formation.creepName = memory.creep;
        }
        formation.originalVanguard = memory.originalVanguard;
        return formation;
    }

    constructor(name: string, localX: number, localY: number) {
        this.name = name;
        this.x = localX;
        this.y = localY;
    }

    public name: string;
    public x: number;
    public y: number;
    public creep: Creep;
    public creepName: string;
    public originalVanguard: boolean;

    public assign(creepName: string): void {
        this.creepName = creepName;
        this.creep = Game.creeps[creepName];
    }

    public release(): void {
        this.creep = undefined;
        this.creepName = undefined;
    }

    public save(): FormationPositionMemory {
        return {
            name: this.name,
            x: this.x,
            y: this.y,
            creep: this.creepName,
            originalVanguard: this.originalVanguard
        };
    }
}
