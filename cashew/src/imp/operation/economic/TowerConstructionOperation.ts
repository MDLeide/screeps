import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class TowerConstructionOperation extends Operation {
    public static fromMemory(memory: TowerConstructionOperationMemory): Operation {
        var op = new this(memory.rcl);
        return Operation.fromMemory(memory, op);
    }

    constructor(rcl: number) {
        super("towerConstruction", TowerConstructionOperation.getAssignments());
        this.rcl = rcl;
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder"),
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder")
        ];
    }


    public rcl: number;


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        var towerLocation = colony.nest.nestMap.mainBlock.getTowerLocation(this.rcl);
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, towerLocation.x, towerLocation.y);
        for (var i = 0; i < look.length; i++) 
            if (look[i].structureType == STRUCTURE_TOWER)
                return true;        
        return false;
    }

    
    protected onInit(colony: Colony): boolean {
        var tower = colony.nest.nestMap.mainBlock.getTowerLocation(this.rcl);
        var result = colony.nest.room.createConstructionSite(tower.x, tower.y, STRUCTURE_TOWER);
        return result == OK;
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
    
    protected onSave(): TowerConstructionOperationMemory {
        var assignmentMemory: AssignmentMemory[] = [];
        for (var i = 0; i < this.assignments.length; i++)
            assignmentMemory.push(this.assignments[i].save());

        return {
            rcl: this.rcl,
            name: this.name,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: assignmentMemory
        };
    }
}

interface TowerConstructionOperationMemory extends OperationMemory {
    rcl: number;
}
