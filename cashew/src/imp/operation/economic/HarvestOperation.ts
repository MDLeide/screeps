import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { HarvesterController } from "../../creep/HarvesterController";

export class HarvestOperation extends ControllerOperation {
    public static fromMemory(memory: HarvestOperationMemory): Operation {
        var op = new this(memory.sourceId, memory.containerId, memory.linkId);        
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor(source: (Source | string), containerId: string, linkId: string) {
        super(OPERATION_HARVEST, []);

        this.sourceId = source instanceof Source ? source.id : source;
        this.containerId = containerId;
        this.linkId = linkId;
    }
        
    
    public sourceId: string;
    public containerId: string;
    public linkId: string;
    
    
    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        for (var i = 0; i < this.assignments.length; i++)
            this.assignments[i].body.minimumEnergy = Math.min(colony.nest.room.energyCapacityAvailable, 5 * BODYPART_COST[WORK] + BODYPART_COST[MOVE] + BODYPART_COST[CARRY]);

        if (Game.time % 500 == 0) {
            let container = colony.resourceManager.structures.getSourceContainer(this.sourceId);
            if (container) this.containerId = container.id;
            let link = colony.resourceManager.structures.getSourceLink(this.sourceId)
            if (link) this.linkId = link.id;

            for (let key in this.controllers) {
                let c = this.controllers[key];
                if (c.type == CREEP_CONTROLLER_HARVESTER) {
                    let harvester = c as HarvesterController;
                    if (link) {
                        harvester.link = link;
                        harvester.linkId = link.id;
                    }
                    if (container) {
                        harvester.container = container;
                        harvester.containerId = container.id;
                    }
                }
            }            
        }
    }

    protected onExecute(colony: Colony): void {  
    }
       
    protected onCleanup(colony: Colony): void {
    }
    

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected onInit(colony: Colony): InitStatus {
        let source = Game.getObjectById<Source>(this.sourceId);
        if (!source)
            return InitStatus.Failed;
        let path = source.pos.findPathTo(colony.nest.spawners[0].spawn);
        let travelTime = path.length * 5;
        let spawnTime = 21;
        let buffer =35;
        let body = BodyRepository.heavyHarvester();
        body.waitForFullEnergy = true;
        let assignment = new Assignment("", body, CREEP_CONTROLLER_HARVESTER, travelTime + spawnTime + buffer);
        this.assignments.push(assignment);

        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(): void {
    }


    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): CreepController {
        return new HarvesterController(this.sourceId, this.containerId, this.linkId);
    }


    protected onSave(): HarvestOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            sourceId: this.sourceId,
            containerId: this.containerId,
            linkId: this.linkId
        };
    }
}

export interface HarvestOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    containerId: string;
    linkId: string
}
