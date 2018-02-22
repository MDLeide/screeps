export abstract class CreepController {
    constructor(name: string) {
        this.name = name;
    }

    public name: string;

    public load(creep: Creep): void {
        this.onLoad(creep);
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
            name: this.name
        };
    }

    protected abstract onLoad(creep: Creep): void;
    protected abstract onUpdate(creep: Creep): void;
    protected abstract onExecute(creep: Creep): void;
    protected abstract onCleanup(creep: Creep): void;
    protected abstract onSave(): CreepControllerMemory;
}
