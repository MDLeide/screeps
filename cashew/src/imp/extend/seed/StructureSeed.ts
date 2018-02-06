import { Seed } from '../../../lib/extend/Seed';

export class StructureSeed extends Seed<AnyStructure>{
    constructor(structure: AnyStructure) {
        super(structure);
    }

    public get structure(): AnyStructure {
        return this.screepsObject;
    }
}
