import { IMilitaryUnit } from "lib/military/IMilitaryUnit";
import { RoomHelper } from "../util/RoomHelper";

export class Unit implements IMilitaryUnit {
    public static fromMemory(memory: UnitMemory): Unit {
        let unit = new this();
        unit.memberNames = memory.memberNames;
        return unit;
    }

    private averagePosition: RoomPosition;
    private spread: number;
    private absoluteSpread: number;
    private scatter: number;
    private diameter: number;

    public members: Creep[] = [];
    public memberNames: string[] = [];
    public get memberCount(): number {
        return this.members.length;
    }


    public load(): void {
        for (var i = 0; i < this.memberNames.length; i++) {
            let creep = Game.creeps[this.memberNames[i]];
            if (creep)
                this.members.push(creep);
        }
        this.averagePosition = undefined;
        this.spread = undefined;
        this.absoluteSpread = undefined;
        this.scatter = undefined;
        this.diameter = undefined;        
    }


    public assign(creep: string | Creep): void {
        if (creep instanceof Creep)
            this.assign(creep.name);
        else {
            let index = this.memberNames.indexOf(creep);
            if (index >= 0)
                return;
            this.memberNames.push(creep);
        }
    }

    public release(creep: string | Creep): void {
        if (creep instanceof Creep) {
            this.release(creep.name);
        } else {
            let index = this.memberNames.indexOf(creep);
            if (index >= 0)
                this.memberNames.splice(index, 1);
        }
    }


    public getAveragePosition(): RoomPosition {
        if (!this.averagePosition)            
            this.averagePosition = RoomHelper.getAveragePosition(this.members.map(p => p.pos));
        return this.averagePosition;
    }

    /** Gets the distance between the two creeps that are furthest apart. */
    public getDiameter(): number {
        if (this.diameter)
            return this.diameter;

        let diameter = 0;
        for (var i = 0; i < this.members.length; i++) {
            let outter = this.members[i];
            for (var j = 0; j < this.members.length; j++) {
                if (i == j)
                    continue;
                let inner = this.members[j];
                let dist = outter.pos.getRangeTo(inner.pos);
                if (dist > diameter)
                    diameter = dist;
            }
        }

        this.diameter = diameter;
        return diameter;
    }

    /** Gets a number that describes how scattered the unit is. Lower means tighter. */
    public getScatter(): number {
        if (this.scatter)
            return this.scatter;

        let count = 0;
        let scatter = 0;
        for (var i = 0; i < this.members.length; i++) {
            let outter = this.members[i];
            for (var j = 0; j < this.members.length; j++) {
                if (i == j)
                    continue;
                let inner = this.members[j];
                let dist = outter.pos.getRangeTo(inner.pos);
                count++;
                scatter += dist;
            }
        }
        this.scatter = scatter / count;
        return this.scatter;
    }

    /** Gets a number that describes how spread from the average center the unit is. */
    public getSpread(): number {
        if (this.spread)
            return this.spread;

        let center = this.getAveragePosition();
        let count = 0;
        let spread = 0;
        for (var i = 0; i < this.members.length; i++) {
            count++;
            spread += this.members[i].pos.getRangeTo(center);
        }
        this.spread = spread / count;
        return this.spread;
    }

    /** Gets the distance from average center to the furthest creep. */
    public getAbsoluteSpread(): number {
        if (this.absoluteSpread)
            return this.absoluteSpread;
        let center = this.getAveragePosition();
        var spread = 0;
        for (var i = 0; i < this.members.length; i++) {
            let dist = this.members[i].pos.getRangeTo(center);
            if (dist > spread)
                spread = dist;
        }

        this.absoluteSpread = spread;
        return spread;
    }



    public attack(target: Creep | Structure): CreepActionReturnCode {
        return this.forEachCreep(this.canAttack, (c) => c.attack(target));        
    }

    public dismantle(target: Structure): CreepActionReturnCode {
        return this.forEachCreep(this.canDismantle, (c) => c.dismantle(target));
    }

    public heal(target: Creep): CreepActionReturnCode {
        return this.forEachCreep(this.canHeal, (c) => c.heal(target));
    }

    public move(direction: DirectionConstant): CreepMoveReturnCode {
        return this.forEachCreep((c) => true, (c) => c.move(direction));
    }

    public moveByPath(path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
        return this.forEachCreep((c) => true, (c) => c.moveByPath(path));
    }

    public moveTo(x: number, y: number, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET
    public moveTo(target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
    public moveTo(xOrTarget: number | RoomPosition | { pos: RoomPosition }, yOrOpts?: number | MoveToOpts, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {       
        if (typeof (xOrTarget) == "number" && typeof (yOrOpts) == "number") {
            return this.forEachCreep(c => true, c => c.moveTo(xOrTarget, yOrOpts, opts));
        } else if (typeof(xOrTarget) != "number" && typeof (yOrOpts) != "number") {
            return this.forEachCreep(c => true, c => c.moveTo(xOrTarget, yOrOpts));
        } else {
            throw new Error("Invalid arguments");
        }
    }       

    public rangedAttack(target: Creep | Structure): CreepActionReturnCode {
        return this.forEachCreep((c) => this.canRangedAttack(c), (c) => c.rangedAttack(target));
    }

    public rangedHeal(target: Creep): CreepActionReturnCode {
        return this.forEachCreep((c) => this.canHeal(c), (c) => c.rangedHeal(target));
    }

    public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
        return this.forEachCreep((c) => this.canRangedAttack(c), (c) => c.rangedMassAttack());
    }

    public healOrRangedHeal(target: Creep, moveTowards: boolean = false): ScreepsReturnCode {
        return this.forEachCreep(this.canHeal, c => {
            let range = c.pos.getRangeTo(target);
            if (range == 1)
                return c.heal(target);
            else if (range <= 3)
                return c.rangedHeal(target);
            else if (moveTowards)
                return c.moveTo(target);
            else
                return ERR_NOT_IN_RANGE;
        });
    }

    protected canAttack(creep: Creep): boolean {
        return creep.getActiveBodyparts(ATTACK) > 0;
    }

    protected canDismantle(creep: Creep): boolean {
        return creep.getActiveBodyparts(WORK) > 0;
    }

    protected canHeal(creep: Creep): boolean {
        return creep.getActiveBodyparts(HEAL) > 0;
    }

    protected canRangedAttack(creep: Creep): boolean {
        return creep.getActiveBodyparts(RANGED_ATTACK) > 0;
    }

    protected forEachCreep<TReturnCode extends number>(predicate: (creep: Creep) => boolean, action: (creep: Creep) => TReturnCode): TReturnCode {
        let returnCode: TReturnCode;
        for (var i = 0; i < this.members.length; i++) {
            let creep = this.members[i];
            if (predicate(creep)) {
                let result = action(creep);
                if (!returnCode || result < returnCode)
                    returnCode = result;
            }
        }
        return returnCode;
    }


    public save(): UnitMemory {
        return {
            memberNames: this.memberNames
        };
    }
}
