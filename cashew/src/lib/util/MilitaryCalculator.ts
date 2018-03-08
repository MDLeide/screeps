export class MilitaryCalculator {

    public static getRangedAttackTarget(creep: Creep): Creep {
        let nearest = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (nearest && nearest.pos.getRangeTo(creep) <= 3)
            return nearest;
        else
            return null;
    }



    public static getNearestHostile(creep: Creep, range?: number): Creep {
        let nearest = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (nearest && range) {
            if (nearest.pos.getRangeTo(creep) <= range)
                return nearest;
            else
                return null;
        } else {
            return nearest;
        }        
    }

    public static getNearestFriendly(creep: Creep, range?: number): Creep {
        let nearest = creep.pos.findClosestByRange(FIND_MY_CREEPS);
        if (nearest && range) {
            if (nearest.pos.getRangeTo(creep) <= range)
                return nearest;
            else
                return null;
        } else {
            return nearest;
        }
    }



    public static getRangedMassAttackDamage(creep: Creep, nearbyTargets?: Creep[]): number {
        if (!nearbyTargets)
            nearbyTargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

        let dmg = 0;
        for (var i = 0; i < nearbyTargets.length; i++) {
            let dist = nearbyTargets[i].pos.getRangeTo(creep);
            if (dist == 3)
                dmg += 10;
            else if (dist == 2)
                dmg += 4;
            else if (dist == 1)
                dmg += 1;
        }
        return dmg;
    }



    public static ThreatEvaluator = class {
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
}

export interface ThreatProfile {
    attack: number;
    heal: number;
    rangedDamage: number;
    dismantle: number;
}


