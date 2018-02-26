import { Body } from "../spawn/Body";
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

export class Assignment {
    public static fromMemory(memory: AssignmentMemory): Assignment {
        let assignment = new this(
            memory.creepName,
            Body.fromMemory(memory.body),
            memory.controllerType);

        return assignment;
    }

    constructor(
        public creepName: string,
        public body: Body,
        public controllerType?: ControllerType) {
    }
    
    /** True if there is no creep assigned. */
    public isOpen(): boolean {
        return !this.creepName;
    }

    /** True if there is a creep assigned. */
    public isFilled(): boolean {
        return !this.isOpen();
    }

    /** Clears the current creep from the assignment. */
    public release(): void {
        this.creepName = undefined;        
    }

    public save(): AssignmentMemory {
        return {
            creepName: this.creepName,
            body: this.body.save(),
            controllerType: this.controllerType
        };
    }
}
