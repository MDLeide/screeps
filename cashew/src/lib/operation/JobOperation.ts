import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Operation } from "./Operation"
import { Job } from "../creep/Job";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

/**
An operation that uses Controllers to manage creeps.
*/
export abstract class JobOperation extends Operation {
    public static fromMemory(memory: JobOperationMemory, instance: JobOperation): Operation {
        for (let key in memory.jobs) {
            instance.jobs[key] = CreepControllerRepository.load(memory.jobs[key]) as Job;
        }
        return Operation.fromMemory(memory, instance);
    }

    public jobs: { [creepName: string]: Job } = {};

    protected abstract getJob(assignment: Assignment): Job;

    public update(colony: Colony): void {
        super.update(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            var creep = Game.creeps[this.assignments[i].creepName];

            if (creep && !creep.spawning) {
                let controller = this.jobs[creep.name];
                if (controller)
                    controller.update(creep);

                if (controller.complete) {
                    this.jobs[creep.name] = this.getJob(this.assignments[i]);
                    if (this.jobs[creep.name])
                        this.jobs[creep.name].update(creep);
                }
            }
        }
    }

    public execute(colony: Colony): void {
        super.execute(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            var creep = Game.creeps[this.assignments[i].creepName];
            if (creep && !creep.spawning) {
                let controller = this.jobs[creep.name];
                if (controller)
                    controller.execute(creep);
            }
        }
        
    }

    public cleanup(colony: Colony): void {        
        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            var creep = Game.creeps[this.assignments[i].creepName];
            if (creep && !creep.spawning) {
                let controller = this.jobs[creep.name];
                if (controller)
                    controller.cleanup(creep);                
            }
        }        
    }
    
    public removeCreep(creepName: string): void {
        super.removeCreep(creepName);
        if (this.jobs[creepName])
            delete this.jobs[creepName];
    }

    protected onAssignment(assignment: Assignment): void {
        this.jobs[assignment.creepName] = this.getJob(assignment);
    }
    
    protected getJobMemory(): { [creepName: string]: JobMemory } {
        var mem = {};
        for (var key in this.jobs)
            mem[key] = this.jobs[key].save();
        return mem;
    }

    protected onSave(): JobOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory()
        };
    }
    
}
