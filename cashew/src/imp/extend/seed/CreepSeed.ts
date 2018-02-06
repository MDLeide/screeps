import { Seed } from '../../../lib/extend/Seed';

export class CreepSeed extends Seed<Creep>{
    constructor(creep: Creep) {
        super(creep);
    }

    public get creep(): Creep {
        return this.screepsObject;
    }
}