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
        instance.jobs = {};
        for (let key in memory.jobs) {
            instance.jobs[key] = CreepControllerRepository.load(memory.jobs[key]) as Job;
        }
        return Operation.fromMemory(memory, instance);
    }
    
    public jobs: { [creepName: string]: Job } = {};
    
    protected abstract getJob(assignment: Assignment): Job;
    
    public load(): void {
        super.load();
        for (let key in this.jobs)
            this.jobs[key].load();
    }

    public update(colony: Colony): void {
        super.update(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.jobs[this.assignments[i].creepName]) {
                let job = this.getJob(this.assignments[i]);
                if (job)
                    this.jobs[this.assignments[i].creepName] = job;
            }
        }

        for (let name in this.jobs) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;

            let job = this.jobs[name];
            if (!job) continue;

            job.update(creep);
            if (job.complete) {
                let assignment = this.findAssignment(name);
                if (!assignment) continue;

                this.jobs[name] = this.getJob(assignment);
                if (this.jobs[name])
                    this.jobs[name].update(creep);
            }
        }
    }

    public execute(colony: Colony): void {
        super.execute(colony);

        for (let name in this.jobs) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;
            let job = this.jobs[name];
            if (job)
                job.execute(creep);
        }        
    }

    public cleanup(colony: Colony): void {        
        super.cleanup(colony);

        for (let name in this.jobs) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;
            let job = this.jobs[name];
            if (job)
                job.cleanup(creep);
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
    
    private getJobMemory(): { [creepName: string]: JobMemory } {
        var mem = {};
        for (var key in this.jobs)
            if (this.jobs[key])
                mem[key] = this.jobs[key].save();
        return mem;
    }
    
    public save(): JobOperationMemory {
        let mem = super.save() as JobOperationMemory;
        mem.jobs = this.getJobMemory();
        return mem;
    }
}
