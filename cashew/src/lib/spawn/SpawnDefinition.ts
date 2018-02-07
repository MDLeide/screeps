import { Body } from "../creep/body/Body";
import { Spawner } from "./Spawner";

export class SpawnDefinition {
    private _bodyDelegate: (energy: number) => Body;
    private _nameDelegate: (spawner: Spawner) => string;

    constructor(roleId: string, minEnergy: number, maxEnergy: number, bodyDelegate: (energy: number) => Body, nameDelegate: (spawner: Spawner) => string) {
        this.roleId = roleId;
        this.minimumEnergy = minEnergy;
        this.maximumEnergy = maxEnergy;

        this._bodyDelegate = bodyDelegate;
        this._nameDelegate = nameDelegate;
    }

    public roleId: string;    
    public minimumEnergy: number;
    public maximumEnergy: number;

    public getBody(energy: number): Body {
        return this._bodyDelegate(energy);
    }

    public getName(spawner: Spawner): string {
        return this._nameDelegate(spawner);
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
