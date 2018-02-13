import { Colony } from "../../../../lib/colony/Colony";
import { ColonyOperation } from "../../../../lib/colony/ColonyOperation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";
import { MapBlock } from "../../../../lib/map/base/MapBlock";
import { MapBlockRepo } from "../../../../lib/map/repo/MapBlockRepo";
import { HarvestBlock } from "../../../../lib/map/blocks/HarvestBlock";



export class HarvestInfrastructureOperation extends ColonyOperation {
    private _source: Source;
    private _sourceBlock: MapBlock;
    private _mapBlockRepo: MapBlockRepo = new MapBlockRepo();

    constructor(source: Source) {
        super("harvestInfrastructure");
        this._source = source;
        this.state.sourceId = source.id;
    }

    public state: HarvestInfrastructureOperationMemory;

    public get source(): Source {
        if (!this._source)
            this._source = Game.getObjectById<Source>(this.state.sourceId);
        return this._source;
    }
    
    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.assigned.length >= 1;
    }


    public isFinished(colony: Colony): boolean {

        var look = this.source.room.lookAt(this.state.standX, this.state.standY);
        for (var i = 0; i < look.length; i++) {
            if (look[i].structure)
                if (look[i].structure.structureType == STRUCTURE_CONTAINER)
                    return true;
        }
        return false;
    }

    protected onInit(colony: Colony): boolean {
        var block: HarvestBlock;

        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            var b = colony.nest.nestMap.harvestBlocks[i];
            var s = b.getSourceLocation();
            if (this.source.pos.x == s.x && this.source.pos.y == s.y) {
                block = b;
                break;
            }
        } 

        var c = b.getContainerLocation();
        this.source.room.createConstructionSite(c.x, c.y, STRUCTURE_CONTAINER);
        this.state.standX = c.x;
        this.state.standY = c.y;
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        var container = this.source.room.lookForAt<LOOK_STRUCTURES>(LOOK_STRUCTURES, this.state.standX, this.state.standY);
        for (var i = 0; i < container.length; i++) {
            if (container[i].structureType == STRUCTURE_CONTAINER) {
                (container[i] as StructureContainer).nut.tag = "source";
                (container[i] as StructureContainer).nut.tagId = this.source.id;
            }
        }
        return true;
    }
    


    protected onUpdate(colony: Colony): void {        
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onGetCreepRequirement(colony: Colony): SpawnDefinition[] {
        var builder = new SpawnDefinition("lightMiner", "lightMiner", 250, 300);
        return [builder];
    }
}

interface HarvestInfrastructureOperationMemory extends ColonyOperationMemory {
    sourceId: string;
    blockId: string;
    standX: number;
    standY: number;
}
