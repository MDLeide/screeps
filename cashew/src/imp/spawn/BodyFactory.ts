
import { Body } from "../../lib/creep/body/Body";
import { Part } from "../../lib/creep/body/Part";
import { PartType } from "../../lib/creep/body/PartType";

export class BodyFactory {
    public static getBody(roleId: string, availableEnergy: number) : Body | null {
        switch (roleId) {
            case "builder":
            case "cobbler":
            case "waller":
            case "lightMiner":
            case "lightUpgrader":
                if (availableEnergy < 250) {
                    return null;
                }
                var partCount = Math.floor(availableEnergy / 250);                
                var parts = [new Part(PartType.MOVE, partCount * 2), new Part(PartType.WORK, partCount), new Part(PartType.CARRY, partCount)];
                return new Body(parts);

            case "heavyHarvester":
                if (availableEnergy < 200) {
                    return null;
                }

                var work = (availableEnergy - 100) / 100;
                work = Math.min(work, 5);
                var parts = [new Part(PartType.WORK, work), new Part(PartType.CARRY, 1), new Part(PartType.MOVE, 1)];
                return new Body(parts);

            case "heavyUpgrader":
                if (availableEnergy < 200) {
                    return null;
                }

                var work = (availableEnergy - 100) / 100;                
                var parts = [new Part(PartType.WORK, work), new Part(PartType.CARRY, 1), new Part(PartType.MOVE, 1)];
                return new Body(parts);
                
            case "transporter":
            case "cleaner":
                if (availableEnergy < 100) {
                    return null;
                }

                var count = availableEnergy / 100;
                var parts = [new Part(PartType.CARRY, count), new Part(PartType.MOVE, count)];
                return new Body(parts);

            case "warrior":
                if (availableEnergy < 100) {
                    return null;
                }

                var count = Math.floor(availableEnergy / 130);
                var parts = [new Part(PartType.ATTACK, count), new Part(PartType.MOVE, count)];
                return new Body(parts);
        }
        return null;
    }
}
