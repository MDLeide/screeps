import { Unit } from "lib/military/Unit";

export abstract class UnitController {
    public static fromMemory(memory: UnitControllerMemory, instance: UnitController): UnitController {
        instance.type = memory.type;
        return instance;
    }

    constructor(type: UnitControllerType) {
        this.type = type;
    }

    public type: UnitControllerType;

    public abstract load(): void;
    public abstract update(unit: Unit): void;
    public abstract execute(unit: Unit): void;
    public abstract cleanup(unit: Unit): void;

    public save(): UnitControllerMemory {
        return {
            type: this.type
        };
    }
}
