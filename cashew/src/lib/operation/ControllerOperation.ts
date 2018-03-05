import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Operation } from "./Operation"
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

/**
An operation that uses Controllers to manage creeps.
*/
export abstract class ControllerOperation extends Operation {
    public static fromMemory(memory: ControllerOperationMemory, instance: ControllerOperation): Operation {
        for (let key in memory.controllers) {
            instance.controllers[key] = CreepControllerRepository.load(memory.controllers[key]);
        }
        return Operation.fromMemory(memory, instance);
    }


    public controllers: { [creepName: string]: CreepController } = {};
    

    protected abstract getController(assignment: Assignment): CreepController;
    protected abstract onSave(): ControllerOperationMemory;

    public load(): void {
        super.load();
        for (let key in this.controllers)
            this.controllers[key].load();
    }

    public update(colony: Colony): void {
        super.update(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            let creep = Game.creeps[this.assignments[i].creepName];
            if (creep && !creep.spawning) {
                let controller = this.controllers[creep.name];
                if (controller)
                    controller.update(creep);
            }

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.update(creep);
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
                let controller = this.controllers[creep.name];
                if (controller)
                    controller.execute(creep);
            }

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.execute(creep);
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
                let controller = this.controllers[creep.name];
                if (controller)
                    controller.cleanup(creep);                
            }

            if (this.assignments[i].replacementName) {
                creep = Game.creeps[this.assignments[i].replacementName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.cleanup(creep);
                }
            }
        }        
    }


    public assignReplacement(assignment: Assignment, creepName: string): boolean {
        if (super.assignReplacement(assignment, creepName)) {
            this.controllers[creepName] = this.getController(assignment);
            return true;
        }
        return false;
    }

    public assignCreep(assignment: Assignment, creepName: string): boolean {
        if (super.assignCreep(assignment, creepName)) {
            this.controllers[creepName] = this.getController(assignment);
            return true;
        }
        return false;
    }

    public releaseAssignment(assignment: Assignment): boolean {
        let creepName = assignment.creepName;
        if (super.releaseAssignment(assignment)) {
            if (this.controllers[creepName])
                delete this.controllers[creepName];
            return true;
        }
        return false;
    }


    protected getControllerMemory(): { [creepName: string]: CreepControllerMemory } {
        var mem = {};
        for (var key in this.controllers)
            mem[key] = this.controllers[key].save();
        return mem;
    }


    protected Save(): ControllerOperationMemory {
        let mem = this.onSave();
        if (mem)
            return mem;

        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory()
        };
    }    
}
