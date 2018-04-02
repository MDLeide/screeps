import { CreepController } from "../../lib/creep/CreepController";
import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";


export class HarvestBuilderJob extends Job {
    public static fromMemory(memory: HarvestBuilderJobMemory): CreepController {
        var job = new this(memory.siteId);
        return Job.fromMemory(memory, job);
    }


    constructor(siteId: string) {
        super(CREEP_CONTROLLER_HARVEST_BUILDER);
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
        let colony = global.empire.getColonyByCreep(creep);
        
        if (creep.carry.energy > 0) {
            return Task.Build(this.targetSite);
        } else {
            let source = creep.pos.findClosestByRange(FIND_SOURCES, { filter: p => p.energy > 0 });
            return Task.Harvest(source);
        }
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }


    protected onSave(): HarvestBuilderJobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete,
            siteId: this.siteId
        };
    }
}

export interface HarvestBuilderJobMemory extends JobMemory {
    siteId: string;
}
