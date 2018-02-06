import { SourceSeed } from "../Seed/SourceSeed";
import { StatefulNut } from "../../../lib/extend/StatefulNut";

export class SourceNut extends StatefulNut<Source, SourceSeed, SourceMemory> {
    constructor(seed: SourceSeed, state: SourceMemory) {
        super(seed, state);
    }

    public get isBeingHarvested(): boolean {
        return this.state.isBeingHarvested;
    }

    public set isBeingHarvested(val: boolean) {
        this.state.isBeingHarvested = val;
    }
}
