import { Colony } from "../colony/Colony"
import { Operation, InitStatus, StartStatus, OperationStatus } from "./Operation"
import { Assignment } from "./Assignment"
import { OperationRepository } from "./OperationRepository";

export class OperationRunner {
    constructor(operation: Operation) {
        this.operation = operation;
    }

    
    public operation: Operation;
    public canceledThisTick: boolean;


    public load(): void {
        if (!this.operation.finished)
            this.operation.load();
    }

    public update(colony: Colony): void {
        if (this.operation.status == OperationStatus.Started)
            if (this.operation.isFinished(colony))
                this.operation.finish(colony);
        
        if (!this.operation.finished)
            this.operation.update(colony);
    }

    public execute(colony: Colony): void {
        if (this.operation.needsStart)
            this.operation.start(colony);
        if (this.operation.needsInit)
            this.operation.init(colony);
        if (this.operation.needsCreepSpawnCheck)
            this.spawnCreepsForOperation(colony);
        if (this.operation.status == OperationStatus.Started)
            this.operation.execute(colony);
    }

    public cleanup(colony: Colony): void {
        if (this.operation.status == OperationStatus.Started && !this.operation.finished)
            if (this.operation.isFinished(colony))
                this.operation.finish(colony);
    }

    public cancel(colony: Colony): void {
        this.canceledThisTick = true;
        this.operation.cancel(colony);
    }


    private spawnCreepsForOperation(colony: Colony) {
        let openAssignments = this.operation.getUnfilledAssignments();

        for (var i = 0; i < openAssignments.length; i++) {
            let creep = this.getCreepForAssignment(openAssignments[i], colony);
            if (creep)
                this.operation.assignCreep(openAssignments[i], creep);
        }

        let replacements = this.operation.getAssignmentsNeedingReplacements();

        for (var i = 0; i < replacements.length; i++) {
            let creep = this.getCreepForAssignment(replacements[i], colony);
            if (creep)
                this.operation.assignReplacement(replacements[i], creep);
        }
    }

    private getCreepForAssignment(assignment: Assignment, colony: Colony): string {
        let unassignedCreep = this.getUnassignedCreep(assignment, colony);
        if (unassignedCreep)
            return unassignedCreep;

        if (assignment.supportRequest) {
            let support = global.empire.requestSpawn(colony, assignment.supportRequest, assignment.maxSupportRange);
            if (support)
                return support;
        }

        if (!colony.canSpawn(assignment.body))
            return null;

        return colony.spawnCreep(assignment.body, this.operation.priority);
    }

    private getUnassignedCreep(assignment: Assignment, colony: Colony): string {
        let unassigned = colony.population.notAssignedToOperation();
        for (var i = 0; i < unassigned.length; i++)             
            if (Memory.creeps[unassigned[i]].body == assignment.body.type)
                return unassigned[i];
        
        return null;
    }
}
