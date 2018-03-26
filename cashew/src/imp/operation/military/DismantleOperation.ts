import { JobOperation } from "lib/operation/JobOperation";
import { Colony } from "lib/colony/Colony";
import { Assignment } from "lib/operation/Assignment";
import { Job } from "lib/creep/Job";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { BodyRepository } from "../../creep/BodyRepository";
import { DismantleJob } from "../../creep/DismantleJob";
import { ScoutJob } from "../../creep/ScoutJob";
import { Dismantle } from "lib/creep/Task";

export class DismantleOperation extends JobOperation {
    public static fromMemory(memory: DismantleOperationMemory): DismantleOperation {
        let targets = [];
        for (var i = 0; i < memory.targets.length; i++)
            targets.push(new RoomPosition(memory.targets[i].x, memory.targets[i].y, memory.targets[i].roomName));
        
        let op = new this(targets);
        return JobOperation.fromMemory(memory, op) as DismantleOperation;
    }

    constructor(targets: RoomPosition[]) {
        super(OPERATION_DISMANTLE, [new Assignment(undefined, BodyRepository.dismantler())]);
        this.targets = targets;
    }

    public targets: RoomPosition[];

    protected onLoad(): void {
    }


    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    
    protected getJob(assignment: Assignment): Job {
        if (!this.targets || !this.targets.length)
            return null;

        while (true) {
            let targetRoom = Game.rooms[this.targets[0].roomName];
            if (!targetRoom)
                return new ScoutJob(this.targets[0].roomName);

            let structures = this.targets[0].lookFor(LOOK_STRUCTURES);
            if (!structures || !structures.length) {
                this.targets.splice(0, 1);
                if (!this.targets.length)
                    return null;

                continue;
            }                

            return new DismantleJob(structures[0]);
        }


    }


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return !this.targets || !this.targets.length;
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

   
    public save(): JobOperationMemory {
        let mem = super.save() as DismantleOperationMemory;
        mem.targets = this.targets;
        return mem;
    }

    public onSave(): JobOperationMemory {
        return null;
    }
}

export interface DismantleOperationMemory extends JobOperationMemory {
    targets: RoomPosition[];
}
