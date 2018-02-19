import { Body } from "../../lib/spawn/Body";

export class BodyRepository {
    public static getBody(name: string): Body {
        switch (name) {
            case "lightWorker":
                return this.lightWorker();
            case "heavyHarvester":
                return this.heavyHarvester();
            case "heavyUpgrader":
                return this.heavyUpgrader();
            case "hauler":
                return this.hauler();
            case "warrior":
                return this.warrior();
            default:
                return null;
        }
    }

    public static lightWorker():Body {
        return new Body(
            "lightWorker",
            250,
            [WORK, MOVE, CARRY, MOVE],
            [WORK, MOVE, CARRY, MOVE],
            0,
            true
        );
    }

    public static heavyHarvester(): Body {
        return new Body(
            "heavyHarvester",
            200,
            [CARRY, MOVE, WORK],
            [WORK],
            4,
            true
        );
    }

    public static heavyUpgrader(): Body {
        return new Body(
            "heavyUpgrader",
            200,
            [CARRY, MOVE, WORK],
            [WORK],
            0,
            true
        );
    }

    public static hauler(): Body {
        return new Body(
            "hauler",
            100,
            [CARRY, MOVE],
            [CARRY, MOVE],
            0,
            true
        );
    }

    public static warrior(): Body {
        return new Body(
            "warrior",
            100,
            [ATTACK, MOVE],
            [ATTACK, MOVE],
            0,
            true
        );
    }
}
