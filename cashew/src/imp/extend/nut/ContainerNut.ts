import { StatefulNut } from "../../../lib/extend/StatefulNut";
import { ContainerSeed } from "../Seed/ContainerSeed";

export class ContainerNut extends StatefulNut<StructureContainer, ContainerSeed, ContainerMemory> {
    constructor(seed: ContainerSeed, state: ContainerMemory) {
        super(seed, state);
    }

    public get container(): StructureContainer {
        return this.seed.container;
    }

    get tag(): string {
        return this.state.tag;
    }

    set tag(val: string) {
        this.state.tag = val;
    }

    get tagId(): string {
        return this.state.tagId;
    }

    set tagId(val: string) {
        this.state.tagId = val;
    }
}


