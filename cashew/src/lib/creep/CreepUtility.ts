export class CreepUtility {
    /**
     * Attemps to swap positions with a creep.
     * @param creep
     */
    public swap(creepA: Creep, creepB: Creep): boolean {
        if (creepA.pos.getRangeTo(creepB) > 1)
            return false;

        var moveA = creepA.pos.getDirectionTo(creepB);
        var moveB = creepB.pos.getDirectionTo(creepA);

        var resultA = creepA.move(moveA);
        if (resultA != OK)
            return false;

        var resultB = creepB.move(moveB);
        return resultB == OK;
    }    
}

export interface ThreatProfile {
    attack: number;
    heal: number;
    rangedDamage: number;
    dismantle: number;
}

export class ThreatEvaluator {
    public static scoreThreatProfile(profile: ThreatProfile): number {
        return profile.attack + profile.heal + profile.rangedDamage + profile.dismantle;
    }

    public static getThreatProfileOfCreep(creep: Creep): ThreatProfile {
        var threatProfile = {
            attack: 0,
            heal: 0,
            rangedDamage: 0,
            dismantle: 0
        };

        for (var i = 0; i < creep.body.length; i++) {
            if (creep.body[i].type != WORK && creep.body[i].type != ATTACK && creep.body[i].type != RANGED_ATTACK && creep.body[i].type != HEAL)
                continue;

            var modifier = 1;

            if (creep.body[i].boost) {
                modifier = this.getBoostModifier(creep.body[i]);
            }

            var power = this.getDefaultPowerOfPart(creep.body[i].type) * modifier;
            switch (creep.body[i].type) {
                case ATTACK:
                    threatProfile.attack += power;
                    break;
                case RANGED_ATTACK:
                    threatProfile.rangedDamage += power;
                    break;
                case HEAL:
                    threatProfile.heal += power;
                    break;
                case WORK:
                    threatProfile.dismantle += power;
                    break;
            }

        }
        return threatProfile;
    }
    
    public static getDefaultPowerOfPart(part: BodyPartConstant) {
        switch (part) {
            case ATTACK:
                return ATTACK_POWER;
            case RANGED_ATTACK:
                return RANGED_ATTACK_POWER;
            case HEAL:
                return HEAL_POWER;
            case WORK:
                return DISMANTLE_POWER;
        }
        return 0;
    }

    public static getBoostModifier(boostedPart: BodyPartDefinition): number {
        switch (boostedPart.type) {
            case WORK:
                if (BOOSTS[WORK][boostedPart.boost].dismantle) {
                    return BOOSTS[WORK][boostedPart.boost].dismantle;
                }
                return 1;
            case ATTACK:
                return BOOSTS[ATTACK][boostedPart.boost].attack;

            case RANGED_ATTACK:
                return BOOSTS[RANGED_ATTACK][boostedPart.boost].rangedAttack;

            case HEAL:
                return BOOSTS[HEAL][boostedPart.boost].heal;
        }
        return 1;
    }
}
