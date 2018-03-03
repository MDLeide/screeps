import { CreepController } from "../../lib/creep/CreepController";
import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";


export class BuilderJob extends Job {
    public static fromMemory(memory: BuildJobMemory): CreepController {
        var job = new this(memory.siteId);
        return Job.fromMemory(memory, job);
    }

    constructor(siteId: string) {
        super(CREEP_CONTROLLER_BUILDER);
        this.siteId = siteId;
        this.targetSite = Game.getObjectById<ConstructionSite>(siteId);
    }

    public siteId: string;
    public targetSite: ConstructionSite;

    protected onLoad(): void {
        this.targetSite = Game.getObjectById<ConstructionSite>(this.siteId);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void { }

    protected isCompleted(): boolean {
        return !this.targetSite || this.targetSite.progress >= this.targetSite.progressTotal;
    }

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getCreepsColony(creep);
        
        if (!this.currentTask || this.currentTask.type == TASK_BUILD) {
            let withdrawTarget = colony.resourceManager.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        } else if (creep.carry.energy > 0) {
            return Task.Build(this.targetSite);
        }

        return null;
    }

    protected isIdle(creep: Creep): Task {
        if (creep.carry.energy > 0) {
            return Task.Build(this.targetSite);
        }
        else {
            let colony = global.empire.getCreepsColony(creep);
            let withdrawTarget = colony.resourceManager.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        }
        return null;
    }


    protected onSave(): BuildJobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete,
            siteId: this.siteId
        };
    }
}

export interface BuildJobMemory extends JobMemory {
    siteId: string;
}
