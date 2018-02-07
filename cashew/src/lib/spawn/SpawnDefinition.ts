import { Spawner } from "./Spawner";
import { CreepNamer } from "./CreepNamer";
import { BodyFactory } from "./BodyFactory";

import { Body } from "../creep/body/Body";

import { Guid } from "../../util/GUID";

export class SpawnDefinition {
    constructor(name: string, roleId: string, minEnergy: number, maxEnergy: number) {
        this.state = {
            id: Guid.newGuid(),
            name: name,
            roleId: roleId,
            minEnergy: minEnergy,
            maxEnergy: maxEnergy
        };    
    }

    public state: SpawnDefinitionMemory;

    public get id(): string { return this.state.id; }
    public get name(): string { return this.state.name; }
    public get roleId(): string { return this.state.roleId; }
    public get minimumEnergy(): number { return this.state.minEnergy; }
    public get maximumEnergy(): number { return this.state.maxEnergy; }

    public getBody(energy: number): Body {
        return BodyFactory.getBody(this, energy);
    }

    public getName(spawner: Spawner): string {
        return CreepNamer.getCreepName(this, spawner);
    }

    public isEqual(def: SpawnDefinition): boolean {
        if (this.minimumEnergy != def.minimumEnergy ||
            this.maximumEnergy != def.maximumEnergy ||
            this.roleId != def.roleId)
            return false;

        var thisMinBody = this.getBody(this.minimumEnergy);
        var thatMinBody = def.getBody(def.minimumEnergy);

        if (!thisMinBody.isEqual(thatMinBody))
            return false;

        var thisMaxBody = this.getBody(this.maximumEnergy);
        var thatMaxBody = def.getBody(def.maximumEnergy);

        if (!thisMaxBody.isEqual(thatMaxBody))
            return false;

        return true;
    }
}
