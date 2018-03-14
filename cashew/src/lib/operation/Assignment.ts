import { Body } from "../creep/Body";
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

export class Assignment {
    public static fromMemory(memory: AssignmentMemory): Assignment {
        let assignment = new this(
            memory.creepName,
            Body.fromMemory(memory.body),
            memory.controllerType,
            memory.replaceAt);

        assignment.replacementName = memory.replacementName;
        assignment.onHold = memory.onHold;
        return assignment;
    }

    constructor(
        creepName: string,
        body: Body,
        controllerType?: CreepControllerType,
        replaceAt?:number) {
        this.creepName = creepName;
        this.body = body;
        this.controllerType = controllerType;
        this.replaceAt = replaceAt;
    }


    public creepName: string;
    public replacementName: string;
    /** Number of ticks before assigned creep dies to assign a replacement. */
    public replaceAt: number;
    public body: Body;
    public controllerType: CreepControllerType;
    public onHold: boolean;


    /** True if there is no creep assigned. */
    public isOpen(): boolean {
        return !this.creepName;
    }

    /** True if there is a creep assigned. */
    public isFilled(): boolean {
        return !this.isOpen();
    }

    /** True if the assignment uses a replacement and does not have one assigned. */
    public replacementOpen(): boolean {
        return this.replaceAt && !this.replacementName;
    }
    
    /** Clears the current creep from the assignment. */
    public release(): void {
        if (this.replacementName) {
            this.creepName = this.replacementName;
            this.replacementName = undefined;
        } else {
            this.creepName = undefined;        
        }        
    }

    public save(): AssignmentMemory {
        return {
            creepName: this.creepName,
            body: this.body.save(),
            controllerType: this.controllerType,
            replacementName: this.replacementName,
            replaceAt: this.replaceAt,
            onHold: this.onHold
        };
    }
}
