import { UnitController } from "./UnitController";
import { Unit } from "./Unit";

export abstract class UnitJob extends UnitController {
    public static fromMemory(memory: UnitJobMemory, instance: UnitJob): UnitJob {
        instance.complete = memory.complete;
        return UnitController.fromMemory(memory, instance) as UnitJob;
    }
    
    public complete: boolean;

    public update(unit: Unit): void {
        if (this.complete)
            return;
        if (this.isComplete(unit))
            this.complete = true;

        if (!this.complete)
            this.onUpdate(unit);
    }

    public execute(unit: Unit): void {
        if (!this.complete)
            this.onExecute(unit);
    }

    public cleanup(unit: Unit): void {
        if (!this.complete)
            this.onCleanup(unit);
    }

    public abstract onUpdate(unit: Unit): void;
    public abstract onExecute(unit: Unit): void;
    public abstract onCleanup(unit: Unit): void;
    public abstract isComplete(unit: Unit): boolean;

    public save(): UnitJobMemory {
        let mem = super.save() as UnitJobMemory;
        mem.complete = this.complete;
        return mem;
    }
}

