import { CreepController } from "../../lib/creep/CreepController";

export class ChemistController extends CreepController {
    public static fromMemory(memory: CreepControllerMemory): CreepController {
        let controller = new this();
        return CreepController.fromMemory(memory, controller);
    }

    constructor() {
        super(CREEP_CONTROLLER_CHEMIST);
    }
    
    protected onLoad(): void { }

    protected onUpdate(creep: Creep): void { }

    protected onExecute(creep: Creep): void { }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): CreepControllerMemory {
        return null;
    }
}
