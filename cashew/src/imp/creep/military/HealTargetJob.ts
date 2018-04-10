import { Job } from "lib/creep/Job";
import { Task } from "lib/creep/Task";

export class HealTargetJob extends Job {
    constructor(target: Creep) {
        super(CREEP_CONTROLLER_HEAL_TARGET);
        this.target = target;
        this.targetId = target.id;
    }

    public target: Creep;
    public targetId: string;

    protected isCompleted(creep: Creep): boolean {
        return (!this.target || this.target.hits >= this.target.hitsMax);
    }

    protected getNextTask(creep: Creep): Task {
        return Task.Heal(creep);
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onLoad(): void {
        super.onLoad();
        this.target = Game.getObjectById<Creep>(this.targetId);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }
}
