import { Body } from "../../lib/creep/Body";

export class BodyRepository {
    public static getBody(type: BodyType): Body {
        switch (type) {
            case BODY_SCOUT:
                return this.scout();
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
            case BODY_DEFENDER:
                return this.defender();
            case BODY_CLAIMER:
                return this.claimer();
            case BODY_RANGER:
                return this.ranger();
            case BODY_HEALER:
                return this.healer();
            case BODY_HOPLITE:
                return this.hoplite();
            case BODY_SHIELD:
                return this.shield();
            default:
                return null;
        }
    }

    public static claimer(): Body {
        return new Body(
            BODY_CLAIMER,
            650,
            [CLAIM, MOVE],
            [CLAIM, MOVE],
            0,
            true
        );
    }

    public static defender(): Body {
        return new Body(
            BODY_DEFENDER,
            190,
            [ATTACK, MOVE],
            [RANGED_ATTACK, MOVE, HEAL, MOVE, ATTACK, MOVE],
            0,
            false
        );
    }

    public static scout(): Body {
        return new Body(
            BODY_SCOUT,
            150,
            [MOVE, MOVE, MOVE],
            [],
            0,
            true
        );
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

    public static ranger(): Body {
        return new Body(
            BODY_RANGER,
            200,
            [RANGED_ATTACK, MOVE],
            [RANGED_ATTACK, MOVE],
            0,
            true
        );
    }

    public static healer(): Body {
        return new Body(
            BODY_HEALER,
            300,
            [HEAL, MOVE],
            [HEAL, MOVE],
            0,
            true
        );
    }

    public static hoplite(): Body {
        return new Body(
            BODY_HOPLITE,
            510,
            [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, ATTACK, MOVE],
            [ATTACK, MOVE, ATTACK, MOVE, RANGED_ATTACK, MOVE],
            0,
            false
        );
    }

    public static shield(): Body {
        return new Body(
            BODY_SHIELD,
            220,
            [TOUGH, MOVE, ATTACK, ATTACK],
            [TOUGH, MOVE],
            0,
            true
        );
    }

}
