//todo: add an additional inventory layer 'completed this tick' to let subsequent activities know
// that they are going to have the energy available

import { Role } from '../../../lib/creep/role/Role';
import { StatefulNut } from '../../../lib/extend/StatefulNut';
import { CreepSeed } from '../Seed/CreepSeed';
import { RoleRepo } from "../../../lib/creep/role/RoleRepo";

export class CreepNut extends StatefulNut<Creep, CreepSeed, CreepMemory> {    
    private _role: Role;
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
    
    public get role(): Role {
        if (!this._role) {
            if (!this.state.role) {
                this._role = RoleRepo.GetNew(this.state.roleId, this.creep);
                this.state.role = this._role.state;
            } else {
                this._role = RoleRepo.LoadFromState(this.state.role);
            }
        }
        return this._role;
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



