import { Seed } from '../../../lib/extend/Seed';

export class SpawnSeed extends Seed<StructureSpawn>{
    constructor(spawn?: StructureSpawn) {
        super(spawn);
    }

    public get spawn(): StructureSpawn {
        return this.screepsObject;
    }
}