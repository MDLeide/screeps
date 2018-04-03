import { ColonyFinder } from "./ColonyFinder";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { FlagOperationDiscovery } from "../operation/FlagOperation";
import { FlagCampaignDiscovery } from "../operation/FlagCampaign";
import { Body } from "../creep/Body";

export class Empire {
    constructor(colonyFinder: ColonyFinder) {
        this.colonies = [];
        for (var key in Memory.empire.colonies)
            this.colonies.push(Colony.fromMemory(Memory.empire.colonies[key]));
        this.colonyFinder = colonyFinder;
    }


    public colonies: Colony[];
    public colonyFinder: ColonyFinder;
    

    /** Adds a colony to the empire and memory. */
    public addColony(colony: Colony): void {
        this.colonies.push(colony);
    }

    /**
     * Removes a Colony from the Empire.
     * @param colony Colony to remove.
     * @param msg An optional string that will be used in logging and console output.
     */
    public removeColony(colony: Colony, msg?: string): void {        
        var removeAt = -1;
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].name == colony.name) {
                removeAt = i;
                break;
            }
        }

        if (removeAt >= 0) {
            this.colonies.splice(removeAt, 1);
            global.events.empire.colonyRemoved(colony.name, msg);
        }
    }

    /** Gets the Colony that a particular Spawn belongs to. */
    public getColonyBySpawn(spawn: StructureSpawn | string): Colony {
        if (spawn instanceof StructureSpawn)
            return this.getColonyBySpawn(spawn.id);

        for (var i = 0; i < this.colonies.length; i++)
            for (var j = 0; j < this.colonies[i].nest.spawners.length; j++)
                if (this.colonies[i].nest.spawners[j].spawnId == spawn)
                    return this.colonies[i];
        return null;
    }

    /** Gets a Colony by its name. */
    public getColonyByName(colony: string): Colony {
        for (var i = 0; i < this.colonies.length; i++)
            if (this.colonies[i].name == colony)
                return this.colonies[i];
        return null;
    }

    /** Gets the Colony that a particular Nest belongs to. */
    public getColonyByNest(nest: Nest): Colony {
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].nest.roomName == nest.roomName)
                return this.colonies[i];
        }
        return null;
    }

    /** Gets the Colony that a particular Creep belongs to. */
    public getColonyByCreep(creep: (Creep | string)): Colony {
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].creepBelongsToColony(creep))
                return this.colonies[i];
        }
        return null;
    }

    /** Transfers a creep to a new colony. */
    public transferCreep(creep: Creep | string, newColony: Colony | string): void {
        if (creep instanceof Creep)
            return this.transferCreep(creep.name, newColony);
        if (newColony instanceof Colony)
            return this.transferCreep(creep, newColony.name);
        let c = this.getColonyByName(newColony);
        if (!c) return;
        let mem = Memory.creeps[creep];
        if (!mem) return;
        mem.colony = newColony;
    }

     /**
     * Tries to request spawn assistance from other colonies.
     * @param requestingColony The Colony requesting the spawn.
     * @param body The body to be spawned.
     */
    public requestSpawn(requestingColony: Colony, body: Body): string
     /**
     * Tries to request spawn assistance from other colonies.
     * @param requestingColony The Colony requesting the spawn.
     * @param body The body to be spawned.
     * @param range The maximum number of rooms on the path between the requesting colony and the fulfilling colony.
     */
    public requestSpawn(requestingColony: Colony, body: Body, range?: number): string
     /**
     * Tries to request spawn assistance from other colonies.
     * @param requestingColony The Colony requesting the spawn.
     * @param body The body to be spawned.
     * @param eligibleColonies Colonies to check for the spawn assistance.
     */
    public requestSpawn(requestingColony: Colony, body: Body, eligibleColonies: Colony[]): string
    public requestSpawn(requestingColony: Colony, body: Body, rangeOrColonies?: number | Colony[]): string {
        let colonies: Colony[];
        if (rangeOrColonies) {
            if (typeof (rangeOrColonies) == "number") {
                for (var i = 0; i < this.colonies.length; i++) {
                    let path = Game.map.findRoute(requestingColony.nest.roomName, this.colonies[i].nest.roomName);
                    if (path == -2)
                        continue;
                    else if (path.length <= rangeOrColonies)
                        colonies.push(this.colonies[i]);
                }
            } else {
                colonies = rangeOrColonies;
            }
        } else {
            colonies = this.colonies;
        }

        for (var i = 0; i < colonies.length; i++) {
            if (colonies[i].canSpawnSupport(body)) {
                let response = colonies[i].spawnCreep(body, undefined, requestingColony);
                if (response)
                    return response;
            }
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
        this.colonyFinder.createNewColonies(this);
        FlagOperationDiscovery.findFlagOperations();
        FlagCampaignDiscovery.findFlagCampaigns();

        for (var i = 0; i < this.colonies.length; i++) {
            let msg = this.colonyShouldBeRemoved(this.colonies[i]);
            if (msg)
                this.removeColony(this.colonies[i--], msg);
        }            

        for (var i = 0; i < this.colonies.length; i++) 
            this.colonies[i].update();
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

    private colonyShouldBeRemoved(colony: Colony): string {
        if (!colony.nest.room)
            return "Nest room no longer owned.";
        if (!colony.nest.room.controller)
            return "Nest room does not have a controller";
        if (!colony.nest.room.controller.my)
            return "Nest room no longer owned.";
        return undefined;
    }
}
