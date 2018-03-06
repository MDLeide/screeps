import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
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


    protected onInit(colony: Colony): boolean {
        let source = Game.getObjectById<Source>(this.sourceId);
        if (!source)
            return false;
        let path = source.pos.findPathTo(colony.nest.spawners[0].spawn);
        let travelTime = path.length * 5;
        let spawnTime = 21;
        let buffer = 25;
        let body = BodyRepository.heavyHarvester();
        let assignment = new Assignment("", body, CREEP_CONTROLLER_HARVESTER, travelTime + spawnTime + buffer);
        this.assignments.push(assignment);

        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
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
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            sourceId: this.sourceId,
            containerId: this.containerId,
            linkId: this.linkId
        };
    }
}

interface HarvestOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    containerId: string;
    linkId: string
}
