import { Colony } from "../colony/Colony";

export class Milestone {
    private _isMetDelegate: (colony: Colony) => boolean;

    constructor(id: string, name: string, isMetDelegate: (colony: Colony) => boolean) {
        this._isMetDelegate = isMetDelegate;
        this.id = id;
        this.name = name;
    }

    public id: string;
    public name: string;

    public isMet(colony: Colony): boolean {
        return this._isMetDelegate(colony);
    }
}
