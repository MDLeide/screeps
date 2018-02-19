import { Body } from "../../lib/spawn/Body";

export class BodyRepository {
    public static getBody(name: string): Body {
        switch (name) {
            case "lightWorker":
                return new Body(
                    "lightWorker",
                    250,
                    [WORK, MOVE, CARRY, MOVE],
                    [WORK, MOVE, CARRY, MOVE],
                    0,
                    true
                );
            case "heavyHarvester":
                return new Body(
                    "heavyHarvester",
                    200,
                    [CARRY, MOVE, WORK],
                    [WORK],
                    4,
                    true
                );
            case "heavyUpgrader":
                return new Body(
                    "heavyUpgrader",
                    200,
                    [CARRY, MOVE, WORK],
                    [WORK],
                    0,
                    true
                );
            case "hauler":
                return new Body(
                    "hauler",
                    100,
                    [CARRY, MOVE],
                    [CARRY, MOVE],
                    0,
                    true
                );
            case "warrior":
                return new Body(
                    "warrior",
                    100,
                    [ATTACK, MOVE],
                    [ATTACK, MOVE],
                    0,
                    true
                );
            default:
                return null;
        }
    }
}
