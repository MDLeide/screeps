//import { PartType } from "./PartType";
//import { ActionType } from "../../../lib/creep/action/ActionType";
//import { PartDataStorageHelper } from "./PartDataStorageHelper";

//export class PartData {
//    private static PartDataStorage: PartDataStorageHelper = new PartDataStorageHelper();

//    private _name: string;
//    private _part: PartType;
//    private _energyCost: number;
//    private _description: string[];
//    private _actionsEnabled: ActionType[];


//    constructor(name: string, part: PartType, energyCost: number, desription: string[], actionsEnabled: ActionType[] ) {
//        this._name = name;
//        this._part = part;
//        this._energyCost = energyCost;
//        this._description = desription;        
//        this._actionsEnabled = actionsEnabled;
//    }


//    public get name(): string {
//        return this._name;
//    }

//    public get part(): PartType {
//        return this._part;
//    }

//    public get energyCost(): number {
//        return this._energyCost;
//    }

//    public get description(): string[] {
//        return this._description;
//    }

//    public get actionsEnabled(): ReadonlyArray<ActionType> {
//        return this._actionsEnabled;
//    }


//    public static GetByType(partType: string | PartType): PartData {
//        return PartData.PartDataStorage.getData(partType);
//    }
    
//    public static get ATTACK(): PartData {
//        return PartData.PartDataStorage.getData(PartType.ATTACK);
//    }
        
//    public static get CARRY(): PartData {
//        return PartData.PartDataStorage.getData(PartType.CARRY);
//    }
    
//    public static get CLAIM(): PartData {
//        return PartData.PartDataStorage.getData(PartType.CLAIM);
//    }
    
//    public static get HEAL(): PartData {
//        return PartData.PartDataStorage.getData(PartType.HEAL);
//    }
    
//    public static get MOVE(): PartData {
//        return PartData.PartDataStorage.getData(PartType.MOVE);
//    }
    
//    public static get RANGED_ATTACK(): PartData {
//        return PartData.PartDataStorage.getData(PartType.RANGED_ATTACK);
//    }
    
//    public static get TOUGH(): PartData {
//        return PartData.PartDataStorage.getData(PartType.TOUGH);
//    }
    
//    public static get WORK(): PartData {
//        return PartData.PartDataStorage.getData(PartType.WORK);
//    }
//}
