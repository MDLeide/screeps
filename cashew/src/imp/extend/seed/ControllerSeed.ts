import { Seed } from '../../../lib/extend/Seed';

export class ControllerSeed extends Seed<StructureController>{
    constructor(controller: StructureController) {
        super(controller);
    }

    public get controller(): StructureController {
        return this.screepsObject;
    }
}