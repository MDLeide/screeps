import { Body } from "../spawn/Body";
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

export class Assignment {
    public static fromMemory(memory: AssignmentMemory): Assignment {
        let assignment = new this(
            memory.creepName,
            Body.fromMemory(memory.body),
            memory.controllerName);

        if (memory.controllerName && memory.controllerName != "")
            assignment.controller = CreepControllerRepository.load(memory.controller);

        return assignment;
    }

    constructor(
        public creepName: string,
        public body: Body,
        public controllerName: string) {
    }

    public controller: CreepController;

    /** True if there is no creep assigned. */
    public isOpen(): boolean {
        return !this.creepName || this.creepName == "";
    }

    /** True if there is a creep assigned. */
    public isFilled(): boolean {
        return !this.isOpen();
    }

    /** Clears the current creep from the assignment. */
    public release(): void {
        this.creepName = undefined;
        this.controller = undefined;
    }

    public save(): AssignmentMemory {
        return {
            creepName: this.creepName,
            body: this.body.save(),
            controllerName: this.controllerName,
            controller: this.controller ? this.controller.save() : null
        };
    }
}
