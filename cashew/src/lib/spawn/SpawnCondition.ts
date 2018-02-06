import { Egg } from "./Egg";
import { Body } from "../creep/body/Body";
import { Role } from "../creep/role/Role";

export class SpawnCondition {
    private bodyDelegate : (spawn: StructureSpawn) => Body;
    

    constructor(roleId: string, minEnergy: number, bodyDelegate: (spawn: StructureSpawn) => Body) {        
        this.roleId = roleId;
        this.minimumEnergy = minEnergy;        
        this.bodyDelegate = bodyDelegate;        
    }

    public roleId: string;
    public roleDelegate: (spawn: StructureSpawn, creep: Creep) => Role;
    public minimumEnergy: number;

    public getEgg(spawn: StructureSpawn): Egg {
        var egg = new Egg();        
        egg.role = this.roleId;
        egg.body = this.bodyDelegate(spawn);        
        return egg;
    }
}
