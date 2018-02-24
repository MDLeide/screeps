import { Body } from "../../lib/spawn/Body";

export class BodyRepository {
    public static getBody(type: BodyType): Body {
        switch (type) {
            case BODY_LIGHT_WORKER:
                return this.lightWorker();
            case BODY_HEAVY_HARVESTER:
                return this.heavyHarvester();
            case BODY_HEAVY_UPGRADER:
                return this.heavyUpgrader();
            case BODY_HAULER:
                return this.hauler();
            case BODY_WARRIOR:
                return this.warrior();
            default:
                return null;
        }
    }

    public static lightWorker():Body {
        return new Body(
            BODY_LIGHT_WORKER,
            250,
            [WORK, MOVE, CARRY, MOVE],
            [WORK, MOVE, CARRY, MOVE],
            0,
            true
        );
    }

    public static heavyHarvester(): Body {
        return new Body(
            BODY_HEAVY_HARVESTER,
            200,
            [CARRY, MOVE, WORK],
            [WORK],
            4,
            true
        );
    }

    public static heavyUpgrader(): Body {
        return new Body(
            BODY_HEAVY_UPGRADER,
            200,
            [CARRY, MOVE, WORK],
            [WORK],
            0,
            true
        );
    }

    public static hauler(): Body {
        return new Body(
            BODY_HAULER,
            100,
            [CARRY, MOVE],
            [CARRY, MOVE],
            0,
            true
        );
    }

    public static warrior(): Body {
        return new Body(
            BODY_WARRIOR,
            100,
            [ATTACK, MOVE],
            [ATTACK, MOVE],
            0,
            true
        );
    }
}
