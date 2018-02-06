import { Seed } from '../../../lib/extend/Seed';

export class SourceSeed extends Seed<Source>{
    constructor(source: Source) {
        super(source);
    }

    public get source(): Source {
        return this.screepsObject;
    }
}