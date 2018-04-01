import { UnitJob } from "lib/military/UnitJob";
import { Unit } from "lib/military/Unit";

export class RallyUnitJob extends UnitJob {
    public static fromMemory(memory: RallyUnitJobMemory): RallyUnitJob {
        let job = new this(new RoomPosition(memory.target.x, memory.target.y, memory.target.roomName));
        return UnitJob.fromMemory(memory, job) as RallyUnitJob;
    }

    constructor(target: RoomPosition) {
        super(UNIT_CONTROLLER_RALLY);
        this.target = target;
    }

    public target: RoomPosition;

    public load(): void {        
    }

    public onUpdate(unit: Unit): void {        
    }

    public onExecute(unit: Unit): void {
        unit.moveTo(this.target);
    }

    public onCleanup(unit: Unit): void {
    }

    public isComplete(unit: Unit): boolean {
        let avgPos = unit.getAveragePosition();
        let dist = avgPos.getRangeTo(this.target);
        let spread = unit.getSpread();
        return dist < unit.memberCount && spread < unit.memberCount; //TODO: refine this condition
    }

    public save(): RallyUnitJobMemory {
        let mem = super.save() as RallyUnitJobMemory;
        mem.target = this.target;
        return mem;
    }
}

export interface RallyUnitJobMemory extends UnitJobMemory {
    target: RoomPosition;
}
