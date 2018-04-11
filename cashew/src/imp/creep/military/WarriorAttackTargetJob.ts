import { Job } from "lib/creep/Job";
import { Task } from "lib/creep/Task";

export class WarriorAttackTargetJob extends Job {
    public static fromMemory(memory: WarriorAttackTargetJobMemory): WarriorAttackTargetJob {
        let target = Game.getObjectById<AttackableTarget>(memory.targetId);
        let job = new this(target);
        job.targetId = memory.targetId;
        return Job.fromMemory(memory, job) as WarriorAttackTargetJob;
    }

    constructor(target: AttackableTarget) {
        super(CREEP_CONTROLLER_WARRIOR_ATTACK_TARGET);
        this.target = target;
        if (target)
            this.targetId = target.id;
    }

    protected isCompleted(creep: Creep): boolean {
        return (!this.target);
    }

    public target: AttackableTarget;
    public targetId: string;

    protected getNextTask(creep: Creep): Task {
        return Task.Attack(this.target);
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onLoad(): void {
        super.onLoad();
        this.target = Game.getObjectById<AttackableTarget>(this.targetId);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }

    public save(): WarriorAttackTargetJobMemory {
        let mem = super.save() as WarriorAttackTargetJobMemory;
        mem.targetId = this.targetId;
        return mem;
    }
}

export interface WarriorAttackTargetJobMemory extends JobMemory {
    targetId: string;
}
