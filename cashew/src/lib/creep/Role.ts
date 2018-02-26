import { CreepController } from "./CreepController";
import { Task } from "./Task"

/**
 * Role is a type of controller that uses tasks to control the creep.
 */
export abstract class Role extends CreepController {
    public static fromMemory<T extends Role>(memory: RoleMemory, instance: T): T {
        if (memory.lastTask)
            instance.lastTask = Task.loadTask(memory.lastTask);
        if (memory.currentTask)
            instance.currentTask = Task.loadTask(memory.currentTask);
        return instance;
    }

    constructor(type: ControllerType, initialTask?: Task) {
        super(type);
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
        } else if (this.currentTask.type == TASK_IDLE) {
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

    protected onSave(): RoleMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined
        };
    }

    protected abstract getNextTask(creep: Creep): Task;
    protected abstract isIdle(creep: Creep): Task;
}


