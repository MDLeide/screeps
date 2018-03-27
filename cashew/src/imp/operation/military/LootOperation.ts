import { JobOperation } from "lib/operation/JobOperation";
import { Assignment } from "lib/operation/Assignment";
import { Colony } from "lib/colony/Colony";
import { Job } from "lib/creep/Job";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { Task } from "lib/creep/Task";
import { TransferJob } from "../../creep/TransferJob";
import { WithdrawJob } from "../../creep/WithdrawJob";
import { BodyRepository } from "../../creep/BodyRepository";


export class LootOperation extends JobOperation {
    public static fromMemory(memory: LootOperationMemory): LootOperation {
        let target = Game.getObjectById<WithdrawTarget>(memory.targetId);
        let op = new this(target);
        return JobOperation.fromMemory(memory, op) as LootOperation;
    }

    constructor(target: WithdrawTarget) {
        super(OPERATION_LOOT, [new Assignment(undefined, BodyRepository.hauler())]);
        this.target = target;
        this.targetId = target.id;
    }


    public target: WithdrawTarget;
    public targetId: string;

    protected getJob(assignment: Assignment): Job {        
        let creep = Game.creeps[assignment.creepName];
        if (!creep)
            return null;

        if (creep.carry.energy > 0) {
            let colony = global.empire.getColonyByCreep(creep);
            return new TransferJob(colony.resourceManager.getTransferTarget(creep));
        } else if (this.target) {
            return new WithdrawJob(this.target);
        } else {
            return null;
        }
    }
        
    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        if (this.target instanceof StructureLab) {
            return this.target.energy == 0;
        } else if (this.target instanceof StructureLink) {
            return this.target.energy == 0;
        } else {
            return this.target.store.energy == 0;
        }
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }

    protected onInit(colony: Colony): InitStatus {
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(): void {
    }

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    public save(): JobOperationMemory {
        let mem = super.save() as LootOperationMemory;
        mem.targetId = this.targetId;
        return mem;
    }

    protected onSave(): JobOperationMemory {
        return null;
    }
}

export interface LootOperationMemory extends JobOperationMemory {
    targetId: string;
}
