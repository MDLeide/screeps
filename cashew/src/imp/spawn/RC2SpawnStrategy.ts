import { SpawnStrategy } from "../../lib/spawn/SpawnStrategy";
import { Egg } from "../../lib/spawn/Egg";
import { SpawnCondition } from "../../lib/spawn/SpawnCondition";
import { BodyFactory } from "./BodyFactory";

export class RC2SpawnStrategy extends SpawnStrategy {
    constructor() {
        super();

        this.addCondition(
            new SpawnCondition(
                "heavyHarvester",
                800,
                (spawn) => {
                    return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
                }));

        this.addCondition(
            new SpawnCondition(
                "transporter",
                800,
                (spawn) => {
                    return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
                }));


        this.addCondition(
            new SpawnCondition(
                "transporter",
                800,
                (spawn) => {
                    return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
                }));

        this.addCondition(
            new SpawnCondition(
                "transporter",
                800,
                (spawn) => {
                    return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
                }));
        
        this.addCondition(
            new SpawnCondition(
                "cleaner",
                800,
                (spawn) => {
                    return BodyFactory.getBody("cleaner", spawn.nut.totalEnergyAvailable());
                }));

        this.addCondition(
            new SpawnCondition(
                "heavyHarvester",
                800,
                (spawn) => {
                    return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
                }));

        
        this.addCondition(
            new SpawnCondition(
                "heavyUpgrader",
                800,
                (spawn) => {
                    return BodyFactory.getBody("heavyUpgrader", spawn.nut.totalEnergyAvailable());
                }));

        this.addCondition(
            new SpawnCondition(
                "heavyUpgrader",
                800,
                (spawn) => {
                    return BodyFactory.getBody("heavyUpgrader", spawn.nut.totalEnergyAvailable());
                }));

        this.addCondition(
            new SpawnCondition(
                "heavyUpgrader",
                800,
                (spawn) => {
                    return BodyFactory.getBody("heavyUpgrader", spawn.nut.totalEnergyAvailable());
                }));
                
        
        this.addCondition(
            new SpawnCondition(
                "builder",
                400,
                (spawn) => {
                    return BodyFactory.getBody("builder", spawn.nut.totalEnergyAvailable());
                }));
               
        this.addCondition(
            new SpawnCondition(
                "waller",
                400,
                (spawn) => {
                    return BodyFactory.getBody("waller", spawn.nut.totalEnergyAvailable());
                }));

        //this.addCondition(
        //    new SpawnCondition(
        //        "warrior",
        //        260,
        //        (spawn) => {
        //            return BodyFactory.getBody("warrior", spawn.nut.totalEnergyAvailable());
        //        }));
        
        //this.addCondition(
        //    new SpawnCondition(
        //        "heavyHarvester",
        //        500,
        //        (spawn) => {
        //            return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
        //        }));

        //this.addCondition(
        //    new SpawnCondition(
        //        "transporter",
        //        500,
        //        (spawn) => {
        //            return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
        //        }));

        //this.addCondition(
        //    new SpawnCondition(
        //        "heavyHarvester",
        //        500,
        //        (spawn) => {
        //            return BodyFactory.getBody("heavyHarvester", spawn.nut.totalEnergyAvailable());
        //        }));

        //this.addCondition(
        //    new SpawnCondition(
        //        "transporter",
        //        500,
        //        (spawn) => {
        //            return BodyFactory.getBody("transporter", spawn.nut.totalEnergyAvailable());
        //        }));
        
        //this.addCondition(
        //    new SpawnCondition(
        //        "heavyUpgrader",
        //        500,
        //        (spawn) => {
        //            return BodyFactory.getBody("heavyUpgrader", spawn.nut.totalEnergyAvailable());
        //        }));
    }
}
