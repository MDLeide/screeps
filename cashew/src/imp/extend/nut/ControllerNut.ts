import { ControllerSeed } from '../Seed/ControllerSeed';
import { StatefulNut } from '../../../lib/extend/StatefulNut';

export class ControllerNut extends StatefulNut<StructureController, ControllerSeed, ControllerMemory> {
    constructor(seed: ControllerSeed, state: ControllerMemory) {
        super(seed, state);
    }

    private _container: StructureContainer;

    public get container(): StructureContainer {
        if (!this._container) {
            this._container = Game.getObjectById<StructureContainer>(this.state.containerId);
        }
        return this._container;
    }

    public set container(container: StructureContainer) {
        this._container = container;
        this.state.containerId = container.id;
    }
}





