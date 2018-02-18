import { Colony } from "../../../../lib/colony/Colony";
import { Operation } from "../../../../lib/operation/Operation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";
import { MapBlock } from "../../../../lib/map/base/MapBlock";
import { HarvestBlock } from "../../../../lib/map/blocks/HarvestBlock";

export class HarvestInfrastructureOperation extends Operation {    
    private _sourceBlock: MapBlock;

    public static fromMemory(memory: HarvestInfrastructureOperationMemory): HarvestInfrastructureOperation {
        var op = new this(memory.sourceId);
        return Operation.fromMemory(op, memory);
    }

    constructor(sourceId: string) {
        super("harvestInfrastructure");        
        this.sourceId = sourceId;
    }


    public source: Source;
    public sourceId: string;
    public standLocation: { x: number, y: number };
    

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.assignedCreeps.length >= 1;
    }

    public isFinished(colony: Colony): boolean {
        var look = this.source.room.lookAt(this.standLocation.x, this.standLocation.y);

        for (var i = 0; i < look.length; i++) {
            if (look[i].structure)
                if (look[i].structure.structureType == STRUCTURE_CONTAINER)
                    return true;
        }
        return false;
    }

    protected onInit(colony: Colony): boolean {
        var harvestBlock: HarvestBlock;

        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            var block = colony.nest.nestMap.harvestBlocks[i];
            var s = block.getSourceLocation();
            if (this.source.pos.x == s.x && this.source.pos.y == s.y) {
                harvestBlock = block;
                break;
            }
        } 

        var container = harvestBlock.getContainerLocation();
        this.source.room.createConstructionSite(container.x, container.y, STRUCTURE_CONTAINER);
        this.standLocation = { x: container.x, y: container.y };
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        var container = this.source.room.lookForAt<LOOK_STRUCTURES>(LOOK_STRUCTURES, this.standLocation.x, this.standLocation.y);

        for (var i = 0; i < container.length; i++) {
            if (container[i].structureType == STRUCTURE_CONTAINER) {
                (container[i] as StructureContainer).nut.tag = "source";
                (container[i] as StructureContainer).nut.tagId = this.source.id;
            }
        }
        return true;
    }



    protected onLoad(): void {
        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(colony: Colony): void {        
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onSave(): HarvestInfrastructureOperationMemory {
        return {
            sourceId: this.sourceId,
            standlocation: this.standLocation,
            name: this.name,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignedCreeps: this.assignedCreeps
        };
    }


    protected onGetCreepRequirement(colony: Colony): SpawnDefinition[] {
        var builder = new SpawnDefinition("lightMiner", "lightMiner", 250, 300);
        return [builder];
    }
}

interface HarvestInfrastructureOperationMemory extends OperationMemory {
    sourceId: string;
    standlocation: { x: number, y: number}
}
