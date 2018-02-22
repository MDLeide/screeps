import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class HarvestOperation extends Operation {

    public static fromMemory(memory: HarvestOperationMemory): Operation {
        var op = new this(memory.minimumEnergy, memory.sourceId);
        return Operation.fromMemory(memory, op);
    }

    constructor(minimumEnergyForSpawn: number, sourceId: string) {
        super("harvest", HarvestOperation.getAssignments(minimumEnergyForSpawn));
        this.minimumEnergy = minimumEnergyForSpawn;
        this.sourceId = sourceId;
    }

    private static getAssignments(minEnergy: number): Assignment[] {
        var body = BodyRepository.getBody("heavyHarvester");
        body.minimumEnergy = minEnergy;
        return [
            new Assignment("", body, "heavyHarvester")
        ]
    }


    public minimumEnergy: number;
    public sourceId: string;


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
    }
    

    protected onInit(colony: Colony): boolean {
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

    protected onSave(): HarvestOperationMemory {
        var assignmentMemory: AssignmentMemory[] = [];
        for (var i = 0; i < this.assignments.length; i++)
            assignmentMemory.push(this.assignments[i].save());

        return {
            minimumEnergy: this.minimumEnergy,
            sourceId: this.sourceId,
            name: this.name,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: assignmentMemory
        };
    }
}

interface HarvestOperationMemory extends OperationMemory {
    minimumEnergy: number;
    sourceId: string;
}
