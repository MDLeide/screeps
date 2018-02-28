//import { Spawner } from "./Spawner";
//import { CreepNamer } from "./CreepNamer";
//import { BodyFactory } from "./BodyFactory";

//import { Body } from "../creep/body/Body";

//export class SpawnDefinition {
//    constructor(name: string, roleId: string, minEnergy: number, maxEnergy: number) {
//        this.name = name;
//        this.roleId = roleId;
//        this.minimumEnergy = minEnergy;
//        this.maximumEnergy = maxEnergy;
//    }
    
//    public name: string;
//    public roleId: string;
//    public minimumEnergy: number;
//    public maximumEnergy: number;

//    public getBody(energy: number): Body {
//        return BodyFactory.getBody(this, energy);
//    }

//    public getName(spawner: Spawner): string {
//        return CreepNamer.getCreepName(this, spawner);
//    }
//}
