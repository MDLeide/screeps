import { Unit } from "lib/military/Unit";
import { UnitJob } from "lib/military/UnitJob";

export class MoveToUnitJob extends UnitJob {


    constructor(target: RoomPosition) {
        super(UNIT_CONTROLLER_MOVE_TO);
        this.target = target;
    }


    public target: RoomPosition;


    public load(): void {
    }

    public onUpdate(unit: Unit): void {
        throw new Error("Method not implemented.");
    }

    public onExecute(unit: Unit): void {
        throw new Error("Method not implemented.");
    }

    public onCleanup(unit: Unit): void {
        throw new Error("Method not implemented.");
    }

    public isComplete(unit: Unit): boolean {
        throw new Error("Method not implemented.");
    }
}

export interface MoveToUnitControllerMemory {

}
