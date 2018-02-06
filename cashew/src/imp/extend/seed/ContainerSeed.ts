import { Seed } from '../../../lib/extend/Seed';

export class ContainerSeed extends Seed<StructureContainer> {
    constructor(container: StructureContainer) {
        super(container);
    }

    public get container(): StructureContainer {
        return this.screepsObject;
    }
}