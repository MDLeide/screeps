import { Colony } from "../../../../lib/colony/Colony";
import { ColonyOperation } from "../../../../lib/colony/ColonyOperation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";
import { MapBlock } from "../../../../lib/map/MapBlock";
import { MapBlockRepo } from "../../../../lib/map/repo/MapBlockRepo";

export class HarvestInfrastructureOperation extends ColonyOperation {
    private _source: Source;
    private _sourceBlock: MapBlock;
    private _mapBlockRepo: MapBlockRepo = new MapBlockRepo();

    constructor(source: Source, heavyHarvestBlock: MapBlock) {
        super("harvestInfrastructure");

        this.state.sourceId = source.id;
        this.state.blockId = heavyHarvestBlock.id;

        this._source = source;
        this._sourceBlock = heavyHarvestBlock;
    }

    public state: HarvestInfrastructureOperationMemory;

    public get source(): Source {
        if (!this._source)
            this._source = Game.getObjectById<Source>(this.state.sourceId);
        return this._source;
    }

    public get sourceBlock(): MapBlock {
        if (!this._sourceBlock)
            this._sourceBlock = this._mapBlockRepo.find(this.state.blockId);
        return this._sourceBlock;
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
        for (var x = 0; x < this.sourceBlock.width; x++) {
            for (var y = 0; y < this.sourceBlock.height; y++) {
                if (this.sourceBlock.getSpecialAt(x, y) == 2) {// container/stand location
                    this.state.standX = x + this.source.pos.x - 1; // assumes source is centered and map is 3x3
                    this.state.standY = y + this.source.pos.y - 1;

                    this.source.room.createConstructionSite(this.state.standX, this.state.standY, STRUCTURE_CONTAINER);                    
                    return true;
                }
            }
        }
        return false;
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
