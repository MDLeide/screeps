import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Operation } from "./Operation"
import { CreepController } from "../creep/CreepController";

/**
An operation that uses Controllers to manage creeps.
*/
export abstract class ControllerOperation extends Operation {
    public controllers: { [creepName: string]: CreepController } = {};

    protected abstract getController(assignment: Assignment): CreepController;

    public update(colony: Colony): void {
        super.update(colony);

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName)
                continue;

            var creep = Game.creeps[this.assignments[i].creepName];
            if (creep && !creep.spawning) {
                let controller = this.controllers[creep.name];
                if (controller)
                    controller.update(creep);
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
        }        
    }
    
    public removeCreep(creepName: string): void {
        super.removeCreep(creepName);
        if (this.controllers[creepName])
            delete this.controllers[creepName];
    }

    protected onAssignment(assignment: Assignment): void {
        this.controllers[assignment.creepName] = this.getController(assignment);
    }

    protected getControllerMemory(): { [creepName: string]: CreepControllerMemory } {
        var mem = {};
        for (var key in this.controllers)
            mem[key] = this.controllers[key].save();
        return mem;
    }

    protected onSave(): ControllerOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory()
        };
    }
}
