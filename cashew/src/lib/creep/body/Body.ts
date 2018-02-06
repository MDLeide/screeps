import { ActionType } from '../../../lib/creep/action/ActionType';
import { Part } from "./Part";
import { BodyState } from "./state/BodyState";
import { IBodyState } from "./state/IBodyState";

/*
I've split Parts up into a few different classes and one enum.
PartType, the enum holds the different part types (MOVE, CARRY, CLAIM, etc.)
PartData represents the static information about a particular part type
Part represents an instance of a part on a Body

I've taken this approach in an attempt to mitigate the impact of 
introducing boosts to the codebase.
*/

/** Holds information about a Creep's body. */
export class Body {    
    private _parts: Part[] | null | undefined;
    private _size: number | undefined;
    private _cost: number | undefined;
    private _partsArray: BodyPartConstant[] | undefined;

    /** The order that the parts are passed will be preserved and used for spawning. */
    constructor(parts: Part[]) {
        if (parts.length < 1) {
            throw new Error('invalid arg: parts array must contain at least one element');
        }

        this.state = new BodyState();
        this.state.parts = [];

        this._parts = parts;
        for (var i = 0; i < parts.length; i++) {
            this.state.parts.push(parts[i].state);
        }        
    }

    public state: IBodyState;

    public get parts(): Part[] {
        if (!this._parts) {
            this._parts = [];
            if (this.state.parts) {
                for (var i = 0; i < this.state.parts.length; i++) {
                    this._parts.push(Part.LoadFromState(this.state.parts[i]));
                }
            }
        }
        return this._parts;
    }

    /** Total number of parts */
    public get size(): number {
        if (!this._size) {
            this._size = _.sum(this.parts, p => p.quantity);
        }
        return this._size;
    }

    /** Length of the spawn period in ticks. */
    public get gestation(): number {
        return this.size * 3;
    }

    public get energyCost(): number {
        if (!this._cost) {
            this._cost = _.sum(this.parts, p => p.energyCost);
        }
        return this._cost;
    }    
    
    /** An array of body part names suitable for use in a StructureSpawn. */
    public get spawnArray(): BodyPartConstant[] {
        if (!this._partsArray) {
            this._partsArray = [];
            for (var i = 0; i < this.parts.length; i++) {
                let p = this.parts[i];
                for (var j = 0; j < p.quantity; j++) {
                    switch (p.data.name) {
                        case "MOVE": this._partsArray.push(MOVE); break;
                        case "WORK": this._partsArray.push(WORK); break;
                        case "CARRY": this._partsArray.push(CARRY); break;
                        case "ATTACK": this._partsArray.push(ATTACK); break;
                        case "RANGED_ATTACK": this._partsArray.push(RANGED_ATTACK); break;
                        case "HEAL": this._partsArray.push(HEAL); break;
                        case "CLAIM": this._partsArray.push(CLAIM); break;
                        case "TOUGH": this._partsArray.push(TOUGH); break;
                    }
                }
            }
        }
        return this._partsArray;
    }

    /** An array of body part names suitable for use in a StructureSpawn. */
    public get stringArray(): string[] {
        return this.spawnArray;
    }
}
