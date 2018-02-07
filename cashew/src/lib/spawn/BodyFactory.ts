import { SpawnDefinition } from "./SpawnDefinition"

import { Body } from "../creep/body/Body";

export class BodyFactory {
    public static getBody(spawnDefinition: SpawnDefinition, energy: number) : Body {
        throw Error("Not implemented");
    }
}
