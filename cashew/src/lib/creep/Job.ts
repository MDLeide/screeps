import { CreepController } from "./CreepController";
import { Role } from "./Role";
import { Task } from "./Task"

/**
 Job is a type of controller that uses tasks to control the creep,
and has a discrete finishing point.
 */
export abstract class Job extends Role {
    public static fromMemory(memory: JobMemory, instance: Job): CreepController {
        instance.complete = memory.complete;
        return Role.fromMemory(memory, instance);
    }

    public complete: boolean;

    public update(creep: Creep): void {
        if (this.isCompleted())
            this.complete = true;
        if (this.complete)
            return;
        super.update(creep);
    }

    public execute(creep: Creep): void {
        if (this.complete)
            return;
        super.execute(creep);
    }

    public cleanup(creep: Creep): void {
        if (this.complete)
            return;
        super.cleanup(creep);
    }

    protected onSave(): JobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete
        };
    }

    protected abstract isCompleted(): boolean;
}
