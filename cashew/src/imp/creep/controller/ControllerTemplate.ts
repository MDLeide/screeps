import { CreepController } from "../../../lib/creep/controller/CreepController";

export class ControllerTemplate extends CreepController {
    public static readonly myName: string = "ControllerTemplate";

    public static fromMemory(memory: CreepControllerMemory ): ControllerTemplate {
        return new this();
    }

    constructor() {
        super(ControllerTemplate.myName);
    }

    protected onLoad(creep: Creep): void {
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
