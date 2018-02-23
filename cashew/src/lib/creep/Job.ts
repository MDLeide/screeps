import { CreepController } from "./CreepController";
import { Task } from "./Task"

/**
 Job is a type of controller that provides some
functionality for Task based creep control.
 */
export abstract class Job extends CreepController {
    public static fromMemory<T extends Job>(memory: JobMemory, instance: T): T {
        if (memory.lastTask)
            instance.lastTask = Task.loadTask(memory.lastTask);
        if (memory.currentTask)
            instance.currentTask = Task.loadTask(memory.currentTask);
        return instance;
    }

    constructor(name: string, initialTask?: Task) {
        super(name);
        this.currentTask = initialTask;
    }
    
    public lastTask: Task;
    public currentTask: Task;

    protected onLoad(creep: Creep): void {        
    }

    protected onUpdate(creep: Creep): void {
        if (this.currentTask)
            this.currentTask.update(creep);

        if (!this.currentTask || this.currentTask.finished) {
            let nextTask = this.getNextTask(creep);
            this.lastTask = this.currentTask;
            if (nextTask)
                this.currentTask = nextTask;
            else
                this.currentTask = Task.Idle();            
        } else if (this.currentTask.name == Task.IdleName) {
            let nextTask = this.isIdle(creep);
            if (nextTask) {
                this.lastTask = this.currentTask;
                this.currentTask = nextTask;
            }                
        }
    }

    protected onExecute(creep: Creep): void {
        this.currentTask.execute(creep);
    }

    protected onCleanup(creep: Creep): void {
        this.currentTask.cleanup(creep);
    }

    protected onSave(): JobMemory {
        return {
            name: this.name,
            lastTask: this.lastTask.save(),
            currentTask: this.currentTask.save()
        };
    }

    protected abstract getNextTask(creep: Creep): Task;
    protected abstract isIdle(creep: Creep): Task;
}

export interface JobMemory extends CreepControllerMemory {
    lastTask: TaskMemory;
    currentTask: TaskMemory;
}
