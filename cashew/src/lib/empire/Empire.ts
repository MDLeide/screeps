import { ColonyFinder } from "./ColonyFinder";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { FlagOperationDiscovery } from "../operation/FlagOperation";
import { FlagCampaignDiscovery } from "../operation/FlagCampaign";

export class Empire {
    constructor(colonyFinder: ColonyFinder) {
        this.colonies = [];
        for (var key in Memory.empire.colonies)
            this.colonies.push(Colony.fromMemory(Memory.empire.colonies[key]));
        this.colonyFinder = colonyFinder;
    }


    public colonies: Colony[];
    public colonyFinder: ColonyFinder;
    

    public searchForColonies(): void {
        this.colonyFinder.createNewColonies(this);
    }

    public getColonyBySpawn(spawn: StructureSpawn): Colony {
        for (var i = 0; i < this.colonies.length; i++)
            for (var j = 0; j < this.colonies[i].nest.spawners.length; j++)
                if (this.colonies[i].nest.spawners[j].spawnId == spawn.id)
                    return this.colonies[i];
        return null;
    }

    public getColonyByName(colony: string): Colony {
        for (var i = 0; i < this.colonies.length; i++)
            if (this.colonies[i].name == colony)
                return this.colonies[i];
        return null;
    }

    public getColonyByNest(nest: Nest): Colony {
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].nest.roomName == nest.roomName)
                return this.colonies[i];
        }
        return null;
    }

    public getColonyByCreep(creep: (Creep | string)): Colony {
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].creepBelongsToColony(creep))
                return this.colonies[i];
        }
        return null;
    }

    //## update loop

    public load(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].load();
        }
    }
    
    public update(): void {
        this.searchForColonies();
        FlagOperationDiscovery.findFlagOperations();
        FlagCampaignDiscovery.findFlagCampaigns();

        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].update();
        }
    }

    public execute(): void {        
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].execute();
        }
    }

    public cleanup(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].cleanup();
        }
    }

    public save(): EmpireMemory {
        var colonies: { [name: string]: ColonyMemory } = {};
        for (var i = 0; i < this.colonies.length; i++)
            colonies[this.colonies[i].name] = this.colonies[i].save();
        return {
            colonies: colonies
        };
    }

    //## end update loop

    
    /** Adds a colony to the empire and memory. */
    public addColony(colony: Colony): void {
        this.colonies.push(colony);
    }

    /** Removes a colony from the empire. */
    public removeColony(colony: Colony): void {
        var removeAt = -1;
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].name == colony.name) {
                removeAt = i;
                break;
            }
        }

        if (removeAt >= 0)             
            this.colonies.splice(removeAt, 1);        
    }
}
