import { BodyFactory as MyBodyFactory } from "./spawn/BodyFactory";

import { Body } from "../lib/creep/body/Body";
import { BodyFactory } from "../lib/spawn/BodyFactory";
import { SpawnDefinition } from "../lib/spawn/SpawnDefinition";

export class BodyRegistration {
    public static register(): void {
        BodyFactory.register(BodyRegistration.getBody);
    }

    private static getBody(def: SpawnDefinition, energy: number): Body {
        return MyBodyFactory.getBody(def.roleId, energy);
    }
}
