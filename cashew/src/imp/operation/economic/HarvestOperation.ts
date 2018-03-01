import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { HarvesterController } from "../../creep/HarvesterController";

export class HarvestOperation extends ControllerOperation {
    public static fromMemory(memory: HarvestOperationMemory): Operation {
        var op = new this(memory.minimumEnergy, memory.sourceId, memory.containerId);
        op.travelTime = memory.travelTime;
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor(minimumEnergyForSpawn: number, source: (Source | string), containerId?: string) {
        super(OPERATION_HARVEST, HarvestOperation.getAssignments(minimumEnergyForSpawn));

        this.minimumEnergy = minimumEnergyForSpawn;
        let s: Source = null;

        if (source instanceof Source) {
            this.sourceId = source.id;
            s = source;
        } else {
            this.sourceId = source;
            if (!containerId)
                s = Game.getObjectById<Source>(source);
        }

        if (containerId)
            this.containerId = containerId;
        else
            this.containerId = s.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
                filter: (struct) => {
                    return struct.structureType == STRUCTURE_CONTAINER;
                }
            }).id;
    }

    private static getAssignments(minEnergy: number): Assignment[] {
        var body = BodyRepository.heavyHarvester();;
        body.minimumEnergy = minEnergy;
        return [
            new Assignment("", body, CREEP_CONTROLLER_HARVESTER)
        ];
    }


    public travelTime: number;
    public minimumEnergy: number;
    public containerId: string;
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
        let source = Game.getObjectById<Source>(this.sourceId);
        if (!source)
            return true;
        let path = source.pos.findPathTo(colony.nest.spawners[0].spawn);
        this.travelTime = path.length * 5;
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

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        if (this.assignments.length == 1) {
            if (this.assignments[0].creepName) {
                let creep = Game.creeps[this.assignments[0].creepName];
                if (creep) {
                    if (creep.ticksToLive <= this.travelTime + 50) {
                        this.assignments.push(new Assignment("", BodyRepository.heavyHarvester(), CREEP_CONTROLLER_HARVESTER));
                    }
                }
            }
        }
    }

    protected onExecute(colony: Colony): void {  
    }
       
    protected onCleanup(colony: Colony): void {
    }

    protected onRelease(assignment: Assignment): void {
        if (this.assignments.length > 1) {
            let index = this.assignments.indexOf(assignment);
            if (index >= 0) {
                this.assignments.splice(index, 1);
            }
        }
    }

    protected getController(assignment: Assignment): CreepController {
        return new HarvesterController(this.containerId, this.sourceId);
    }

    protected onSave(): HarvestOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            minimumEnergy: this.minimumEnergy,
            sourceId: this.sourceId,
            containerId: this.containerId,
            travelTime: this.travelTime
        };
    }
}

interface HarvestOperationMemory extends ControllerOperationMemory {
    minimumEnergy: number;
    sourceId: string;
    containerId: string;
    travelTime: number;
}
