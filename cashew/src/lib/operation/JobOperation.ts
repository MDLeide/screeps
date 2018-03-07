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
    protected abstract onSave(): JobOperationMemory;

    public load(): void {
        super.load();
        for (let key in this.jobs)
            this.jobs[key].load();
    }

    public update(colony: Colony): void {
        super.update(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            let creep = Game.creeps[this.assignments[i].creepName];

            if (creep && !creep.spawning) {
                let job = this.jobs[creep.name];
                if (job)
                    job.update(creep);


                if (job && job.complete) {
                    this.jobs[creep.name] = this.getJob(this.assignments[i]);
                    if (this.jobs[creep.name])
                        this.jobs[creep.name].update(creep);
                }
            }

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let job = this.jobs[creep.name];
                    if (job)
                        job.update(creep);
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

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let job = this.jobs[creep.name];
                    if (job)
                        job.execute(creep);
                }
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

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let job = this.jobs[creep.name];
                    if (job)
                        job.cleanup(creep);
                }
            }
        }        
    }


    public assignReplacement(assignment: Assignment, creepName: string): boolean {
        if (super.assignReplacement(assignment, creepName)) {
            this.jobs[assignment.creepName] = this.getJob(assignment);
            return true;
        }
        return false;
    }

    public assignCreep(assignment: Assignment, creepName: string): boolean {
        if (super.assignCreep(assignment, creepName)) {
            this.jobs[assignment.creepName] = this.getJob(assignment);
            return true;
        }
        return false;
    }

    public releaseAssignment(assignment: Assignment): boolean {
        let creepName = assignment.creepName;
        if (super.releaseAssignment(assignment)) {
            if (this.jobs[creepName])
                delete this.jobs[creepName];
            return true;
        }
        return false;
    }
    

    protected getJobMemory(): { [creepName: string]: JobMemory } {
        var mem = {};
        for (var key in this.jobs)
            if (this.jobs[key])
                mem[key] = this.jobs[key].save();
        return mem;
    }
    

    public save(): JobOperationMemory {
        let mem = this.onSave();
        if (mem)
            return mem;

        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory()
        };
    }

}
