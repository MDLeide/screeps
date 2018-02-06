import { PartDescription } from "./PartDescription";
import { ActionType } from "../../action/ActionType";


export class PartData {
    private static _attack: PartDescription;
    private static _carry: PartDescription;
    private static _claim: PartDescription;
    private static _heal: PartDescription;
    private static _move: PartDescription;
    private static _rangedAttack: PartDescription;
    private static _tough: PartDescription;
    private static _work: PartDescription;

    public static getPartDescription(part: BodyPartConstant): PartDescription {
        switch (part) {
            case ATTACK:
                if (!PartData._attack)
                    PartData._attack = PartData.makeAttack();
                return PartData._attack;
            case CARRY:
                if (!PartData._carry)
                    PartData._carry = PartData.makeCarry();
                return PartData._carry;
            case CLAIM:
                if (!PartData._claim)
                    PartData._claim = PartData.makeClaim();
                return PartData._claim;
            case HEAL:
                if (!PartData._heal)
                    PartData._heal = PartData.makeHeal();
                return PartData._heal;
            case MOVE:
                if (!PartData._move)
                    PartData._move = PartData.makeMove();
                return PartData._move;
            case RANGED_ATTACK:
                if (!PartData._rangedAttack)
                    PartData._rangedAttack = PartData.makeRangedAttack();
                return PartData._rangedAttack;
            case TOUGH:
                if (!PartData._tough)
                    PartData._tough = PartData.makeTough();
                return PartData._tough;
            case WORK:
                if (!PartData._work)
                    PartData._work = PartData.makeWork();
                return PartData._work;
            default:
                throw Error("Arg out of range");
        }
    }

    private static makeAttack(): PartDescription {
        return new PartDescription(
            'ATTACK',
            ATTACK,
            80,
            ['Attacks another creep/structure with 30 hits per tick in a short-ranged attack.'],
            [ActionType.ATTACK]
        );
    }

    private static makeCarry(): PartDescription {
        return new PartDescription(
            'CARRY',
            CARRY,
            50,
            ['Can contain up to 50 resource units.'],
            [
                ActionType.TRANSFER,
                ActionType.WITHDRAW,
                ActionType.DROP
            ]
        );
    }

    private static makeClaim(): PartDescription {
        return new PartDescription(
            'CLAIM',
            CLAIM,
            600,
            [
                'Claims a neutral room controller.',
                'Reserves a neutral room controller for 1 tick per body part.',
                'Attacks a hostile room controller downgrade or reservation timer with 1 tick per 5 body parts.',
                'A creep with this body part will have a reduced life time of 500 ticks and cannot be renewed.'
            ],
            [
                ActionType.CLAIM_CONTROLLER,
                ActionType.RESERVE_CONTROLLER,
                ActionType.ATTACK_CONTROLLER
            ]
        );
    }

    private static makeHeal(): PartDescription {
        return new PartDescription(
            'HEAL',
            HEAL,
            250,
            ['Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance.'],
            [
                ActionType.HEAL,
                ActionType.RANGED_HEAL
            ]
        );
    }

    private static makeMove(): PartDescription {
        return new PartDescription(
            'MOVE',
            MOVE,
            50,
            ['Decreases fatigue by 2 points per tick.'],
            [ActionType.MOVE]
        );
    }

    private static makeRangedAttack(): PartDescription {
        return new PartDescription(
            'RANGED_ATTACK',
            RANGED_ATTACK,
            150,
            [
                'Attacks another single creep/ structure with 10 hits per tick in a long- range attack up to 3 squares long.',
                'Attacks all hostile creeps/ structures within 3 squares range with 1- 4 - 10 hits (depending on the range).'
            ],
            [
                ActionType.RANGED_ATTACK,
                ActionType.RANGED_MASS_ATTACK
            ]
        );
    }

    private static makeTough(): PartDescription {
        return new PartDescription(
            'TOUGH',
            TOUGH,
            10,
            ["No effect, just additional hit points to the creep's body.Can be boosted to resist damage."],
            []
        );
    }

    private static makeWork(): PartDescription {
        return new PartDescription(
            'WORK',
            WORK,
            100,
            [
                'Harvests 2 energy units from a source per tick.',
                'Harvests 1 mineral unit from a deposit per tick.',
                'Builds a structure for 5 energy units per tick.',
                'Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.',
                'Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.',
                'Upgrades a controller for 1 energy unit per tick.'
            ],
            [
                ActionType.HARVEST,
                ActionType.BUILD,
                ActionType.REPAIR,
                ActionType.DISMANTLE,
                ActionType.UPGRADE_CONTROLLER
            ]
        );
    }
}
