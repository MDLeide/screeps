import { PartDescription } from "./parts/PartDescription";
import { PartData } from "./parts/PartData";

export class Body {
    private _parts: BodyPartConstant[];
    private _energyCost: number | null = null;
    private _descriptions: PartDescription[];

    constructor(parts: BodyPartConstant[]) {
        if (!parts) 
            throw Error("Parts cannot be null or undefined.");

        if (!parts.length)
            throw Error("Parts cannot be empty");

        this._parts = parts;
    }

    public get parts(): BodyPartConstant[] {        
        return this._parts;
    }

    public get energyCost(): number {
        if (_.isNull(this._energyCost))
            this._energyCost = _.sum(this.descriptions, (p: PartDescription) => p.energyCost);
        return this._energyCost;
    }

    public get descriptions(): PartDescription[] {
        if (!this._descriptions || !this._descriptions.length)
            for (var i = 0; i < this.parts.length; i++)
                this._descriptions.push(PartData.getPartDescription(this.parts[i]));
        return this._descriptions;
    }
}
