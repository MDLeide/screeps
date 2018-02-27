export abstract class CreepController {
    public static fromMemory(memory: CreepControllerMemory, instance: CreepController): CreepController {
        instance.type = memory.type;
        return instance;
    }

    constructor(type: ControllerType) {
        this.type = type;
    }

    public type: ControllerType;

    public load(): void {
        this.onLoad();
    }

    public update(creep: Creep): void{
        this.onUpdate(creep);
    }

    public execute(creep: Creep): void {
        this.onExecute(creep);
    }

    public cleanup(creep: Creep): void {
        this.onCleanup(creep);
    }

    public save(): CreepControllerMemory {
        var mem = this.onSave();
        if (mem)
            return mem;

        return {
            type: this.type
        };
    }

    protected abstract onLoad(): void;
    protected abstract onUpdate(creep: Creep): void;
    protected abstract onExecute(creep: Creep): void;
    protected abstract onCleanup(creep: Creep): void;
    protected abstract onSave(): CreepControllerMemory;
}
