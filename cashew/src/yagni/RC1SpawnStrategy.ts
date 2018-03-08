//import { SpawnStrategy } from "../../lib/spawn/SpawnStrategy";
//import { Egg } from "../../lib/spawn/Egg";
//import { SpawnCondition } from "../../lib/spawn/SpawnCondition";
//import { BodyFactory } from "./BodyFactory";

//export class RC1SpawnStrategy extends SpawnStrategy {
//    constructor() {
//        super();

//        //this.addCondition(
//        //    new SpawnCondition(
//        //        "lightMiner",
//        //        200,
//        //        (spawn) => {
//        //            return BodyFactory.getBody("lightMiner", spawn.nut.totalEnergyAvailable());
//        //        }
//        //    ));

//        this.addCondition(
//            new SpawnCondition(
//                "heavyHarvester",
//                300,
//                (spawn) => {
//                    return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
//                }));

//        this.addCondition(
//            new SpawnCondition(
//                "transporter",
//                300,
//                (spawn) => {
//                    return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
//                }));

//        this.addCondition(
//            new SpawnCondition(
//                "heavyHarvester",
//                300,
//                (spawn) => {
//                    return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
//                }));

//        this.addCondition(
//            new SpawnCondition(
//                "heavyUpgrader",
//                300,
//                (spawn) => {
//                    return BodyFactory.getBody("heavyUpgrader", spawn.nut.totalEnergyAvailable());
//                }));

//        this.addCondition(
//            new SpawnCondition(
//                "builder",
//                300,
//                (spawn) => {
//                    return BodyFactory.getBody("builder", spawn.nut.totalEnergyAvailable());
//                }));
//    }
//}
