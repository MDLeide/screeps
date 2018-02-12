import { SpawnDefinition } from "./SpawnDefinition"

import { Body } from "../creep/body/Body";

export class BodyFactory {
    private static _delegate: (spawnDef: SpawnDefinition, energy: number) => Body;

    public static getBody(spawnDefinition: SpawnDefinition, energy: number) : Body {
        return this._delegate(spawnDefinition, energy);
    }

    public static register(delegate: (spawnDef: SpawnDefinition, energy: number) => Body) {
        this._delegate = delegate;
    }
}
