
import { Body } from "../../lib/creep/body/Body";
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
                var parts: BodyPartConstant[] = [];

                for (var i = 0; i < partCount; i++) {
                    parts.push(WORK);
                    parts.push(MOVE);
                    parts.push(CARRY);
                    parts.push(MOVE);
                }
                
                return new Body(parts);

            case "heavyHarvester":
                if (availableEnergy < 200) {
                    return null;
                }

                var partCount = Math.floor((availableEnergy - 100) / 100);
                partCount = Math.min(partCount, 5);                

                var parts: BodyPartConstant[] = [];

                for (var i = 0; i < partCount; i++) {
                    parts.push(WORK);
                }

                parts.push(CARRY);                    
                parts.push(MOVE);

                return new Body(parts);

            case "heavyUpgrader":
                if (availableEnergy < 200) {
                    return null;
                }

                var partCount = Math.floor((availableEnergy - 100) / 100);

                var parts: BodyPartConstant[] = [];

                for (var i = 0; i < partCount; i++) {
                    parts.push(WORK);
                }

                parts.push(CARRY);
                parts.push(MOVE);

                return new Body(parts);
                
            case "transporter":
            case "cleaner":
                if (availableEnergy < 100) {
                    return null;
                }

                var partCount = Math.floor(availableEnergy / 100);

                var parts: BodyPartConstant[] = [];

                for (var i = 0; i < partCount; i++) {
                    parts.push(CARRY);
                    parts.push(MOVE);
                }

                return new Body(parts);

            case "warrior":
                if (availableEnergy < 100) {
                    return null;
                }
                
                var partCount = Math.floor(availableEnergy / 130);

                var parts: BodyPartConstant[] = [];

                for (var i = 0; i < partCount; i++) {
                    parts.push(ATTACK);
                    parts.push(MOVE);
                }

                return new Body(parts);
        }
        return null;
    }
}
