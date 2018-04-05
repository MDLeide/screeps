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
    
    public load(): void {
        super.load();
        for (let key in this.controllers)
            this.controllers[key].load();
    }

    public update(colony: Colony): void {
        super.update(colony);

        for (let name in this.controllers) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;
            let controller = this.controllers[name];
            if (controller)
                controller.update(creep);
        }
    }

    public execute(colony: Colony): void {
        super.execute(colony);

        for (let name in this.controllers) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;
            let controller = this.controllers[name];
            if (controller)
                controller.execute(creep);
        }
    }

    public cleanup(colony: Colony): void {
        super.cleanup(colony);

        for (let name in this.controllers) {
            let creep = Game.creeps[name];
            if (!creep || creep.spawning) continue;
            let controller = this.controllers[name];
            if (controller)
                controller.cleanup(creep);
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
    
    private getControllerMemory(): { [creepName: string]: CreepControllerMemory } {
        var mem = {};
        for (var key in this.controllers)
            mem[key] = this.controllers[key].save();
        return mem;
    }
    
    public save(): ControllerOperationMemory {
        let mem = super.save() as ControllerOperationMemory;
        mem.controllers = this.getControllerMemory();
        return mem;
    }    
}
