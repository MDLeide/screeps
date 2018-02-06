import { PartType } from "./PartType";
import { PartState } from "./state/PartState";
import { IPartState } from "./state/IPartState";
import { PartData } from "./PartData";

/** Represnts an instance of 1 or more of a single part type on a body. */
export class Part {
    

    private static StringToPartMap: { [part: string]: PartType } = {
        work: PartType.WORK,
        carry: PartType.CARRY,
        attack: PartType.ATTACK,
        rangedattack: PartType.RANGED_ATTACK,
        'ranged attack':PartType.RANGED_ATTACK,
        ranged_attack: PartType.RANGED_ATTACK,
        heal: PartType.HEAL,
        claim: PartType.CLAIM,
        tough: PartType.TOUGH,
    };

    private static _partToStringMap: { [partType: number]: string } | null | undefined;
    private static get PartToStringMap(): { [partType: number]: string } {
        if (!this._partToStringMap) {
            this._partToStringMap = {};
            this._partToStringMap[PartType.WORK] = 'work';
            this._partToStringMap[PartType.CARRY] = 'carry';
            this._partToStringMap[PartType.ATTACK] = 'attack';
            this._partToStringMap[PartType.RANGED_ATTACK] = 'ranged_attack';
            this._partToStringMap[PartType.HEAL] = 'heal';
            this._partToStringMap[PartType.CLAIM] = 'claim';
            this._partToStringMap[PartType.TOUGH] = 'tough';
        }
        return this._partToStringMap;
    };

    constructor(type: PartType, quantity: number) {
        this.state = new PartState();
        this.state.type = type;
        this.state.quantity = Math.floor(quantity);
    }

    public state: IPartState;
    
    public get quantity(): number {
        return this.state.quantity;
    }
    
    public get type(): PartType {
        return this.state.type;
    }

    public get data(): PartData {
        return PartData.GetByType(this.type);
    }

    /** Returns the total energy cost for this part (cost * quantity). */
    public get energyCost(): number {
        return this.data.energyCost * this.quantity;
    }


    public static PartTypeToString(part: PartType): string {
        return this.PartToStringMap[part];
    }

    public static StringToPartType(part: string): PartType | null | undefined {
        part = part.toLowerCase().trim();
        if (this.StringToPartMap[part]) {
            return this.StringToPartMap[part];
        }
        return null;        
    }

    public static LoadFromState(state: IPartState): Part {
        let p = Object.create(Part.prototype);
        p.state = state;
        return p;
    }
}
