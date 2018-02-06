import { ActionType } from "../../action/ActionType";

export class PartDescription {
    private _name: string;
    private _part: BodyPartConstant;
    private _energyCost: number;
    private _description: string[];
    private _actionsEnabled: ActionType[];

    constructor(name: string, part: BodyPartConstant, energyCost: number, desription: string[], actionsEnabled: ActionType[]) {
        this._name = name;
        this._part = part;
        this._energyCost = energyCost;
        this._description = desription;
        this._actionsEnabled = actionsEnabled;
    }

    public get name(): string {
        return this._name;
    }

    public get part(): BodyPartConstant {
        return this._part;
    }

    public get energyCost(): number {
        return this._energyCost;
    }

    public get description(): string[] {
        return this._description;
    }

    public get actionsEnabled(): ReadonlyArray<ActionType> {
        return this._actionsEnabled;
    }
}
