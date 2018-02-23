//todo: add an additional inventory layer 'completed this tick' to let subsequent activities know
// that they are going to have the energy available

import { StatefulNut } from '../../../lib/extend/StatefulNut';
import { CreepSeed } from '../Seed/CreepSeed';

export class CreepNut extends StatefulNut<Creep, CreepSeed, CreepMemory> {    
    private _home: StructureSpawn;

    constructor(seed: CreepSeed, state: CreepMemory) {
        super(seed, state);
    }

    public get home(): StructureSpawn {
        if (!this._home) {
            this._home = Game.getObjectById<StructureSpawn>(this.state.homeSpawnId);
        }
        return this._home;
    }

    public get creep(): Creep {        
        return this.seed.creep;
    }
            
    public get carryTotal(): number {
        return _.sum(this.creep.carry);
    }

    public get carryCapacityAvailable(): number {
        return this.creep.carryCapacity - this.carryTotal;
    }
    
    public get energyAvailable(): number {
        return this.creep.carry[RESOURCE_ENERGY];
    }

    public sortByRange<T extends { pos: RoomPosition }>(targets: T[]): T[] {
        return targets.sort((a, b): number => {
            var distA = a.pos.getRangeTo(this.creep.pos);
            var distB = b.pos.getRangeTo(this.creep.pos);
            return distA - distB;
        });
    }
}



