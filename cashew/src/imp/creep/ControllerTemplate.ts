import { CreepController } from "../../lib/creep/CreepController";

export class ControllerTemplate extends CreepController {
    public static fromMemory(memory: CreepControllerMemory ): ControllerTemplate {
        return new this();
    }

    constructor() {
        super(CREEP_CONTROLLER_HARVESTER);
    }

    protected onLoad(): void {
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): CreepControllerMemory {
        return null;
    }
}
