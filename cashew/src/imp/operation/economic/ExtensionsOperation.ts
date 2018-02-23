import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class ExtensionsOperation extends Operation {
    public static fromMemory(memory: ExtensionsOperationMemory): Operation {
        var op = new this(memory.rcl);
        return Operation.fromMemory(memory, op);
    }

    constructor(rcl: number) {
        super("extensions", ExtensionsOperation.getAssignments());
        this.rcl = rcl;
    }


    public rcl: number;


    private static getAssignments(): Assignment[]{
        return [
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder"),
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder")
        ];
    }

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        var targetCount = 0;
        for (var i = 0; i < this.rcl; i++) 
            targetCount += colony.nest.nestMap.extensionBlock.getExtensionLocations(i + 1).length;

        var extensionCount = colony.nest.room.find(FIND_MY_STRUCTURES, {
            filter: (struct) => {
                return struct.structureType == STRUCTURE_EXTENSION;
            }
        }).length;

        return targetCount == extensionCount;
    }


    protected onInit(colony: Colony): boolean {
        var locs = colony.nest.nestMap.extensionBlock.getExtensionLocations(this.rcl);

        for (var i = 0; i < locs.length; i++) {
            colony.nest.room.createConstructionSite(locs[i].x, locs[i].y, STRUCTURE_EXTENSION);
        }

        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onSave(): ExtensionsOperationMemory {
        return {
            rcl: this.rcl,
            name: this.name,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory()
        };
    }
}

interface ExtensionsOperationMemory extends OperationMemory {
    rcl: number;
}
