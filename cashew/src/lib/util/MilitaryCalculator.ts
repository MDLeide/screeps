export class MilitaryCalculator {

    public static getRangedAttackTarget(position: RoomPosition | { pos: RoomPosition }): Creep {
        if (!(position instanceof RoomPosition))
            return this.getRangedAttackTarget(position.pos);

        let nearest = position.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (nearest && nearest.pos.getRangeTo(position) <= 3)
            return nearest;
        else
            return null;
    }
    
    public static getNearestHostile(position: RoomPosition | { pos: RoomPosition }, range?: number): Creep {
        if (!(position instanceof RoomPosition))
            return this.getNearestHostile(position.pos);

        let nearest = position.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (nearest && range) {
            if (nearest.pos.getRangeTo(position) <= range)
                return nearest;
            else
                return null;
        } else {
            return nearest;
        }        
    }

    public static getHostiles(position: RoomPosition | { pos: RoomPosition }, range?: number): Creep[] {
        if (!(position instanceof RoomPosition))
            return this.getHostiles(position.pos);

        if (range)
            return position.findInRange(FIND_HOSTILE_CREEPS, range);
        else if (Game.rooms[position.roomName])
            return Game.rooms[position.roomName].find(FIND_HOSTILE_CREEPS);
        else
            return [];
    }

    public static getNearestFriendly(position: RoomPosition | { pos: RoomPosition }, range?: number): Creep {
        if (!(position instanceof RoomPosition))
            return this.getNearestFriendly(position.pos);

        let nearest = position.findClosestByRange(FIND_MY_CREEPS);
        if (nearest && range) {
            if (nearest.pos.getRangeTo(position) <= range)
                return nearest;
            else
                return null;
        } else {
            return nearest;
        }
    }
    
    public static getRangedMassAttackDamage(position: RoomPosition | { pos: RoomPosition }, nearbyTargets?: Creep[]): number {
        if (!position)
            return 0;

        if (!(position instanceof RoomPosition))
            return this.getRangedMassAttackDamage(position.pos);

        if (!nearbyTargets)
            nearbyTargets = position.findInRange(FIND_HOSTILE_CREEPS, 3);

        let dmg = 0;
        for (var i = 0; i < nearbyTargets.length; i++) {
            let dist = nearbyTargets[i].pos.getRangeTo(position);
            if (dist == 3)
                dmg += 10;
            else if (dist == 2)
                dmg += 4;
            else if (dist == 1)
                dmg += 1;
        }
        return dmg;
    }

    public static getNearestDamagedFriendly(position: RoomPosition | { pos: RoomPosition }, range: number = 0, healThreshold: number = 1): Creep {
        if (!(position instanceof RoomPosition))
            return this.getNearestDamagedFriendly(position.pos);

        let nearest = position.findClosestByRange(
            FIND_MY_CREEPS,
            {
                filter: (c) => c.hitsMax - c.hits >= healThreshold
            });
        if (nearest && range) {
            if (position.getRangeTo(nearest) <= range)
                return nearest;
            else
                return null;
        }
        return nearest;
    }

    public static getDamagedFriendlies(position: RoomPosition | { pos: RoomPosition }, range: number = 0, healThreshold: number = 1): Creep[] {
        if (!(position instanceof RoomPosition))
            return this.getDamagedFriendlies(position.pos);
        
        if (range)
            return position.findInRange(
                FIND_MY_CREEPS,
                range,
                {
                    filter: (c) => c.hitsMax - c.hits >= healThreshold
                });
        else if (Game.rooms[position.roomName])
            return Game.rooms[position.roomName].find(
                FIND_MY_CREEPS,
                {
                    filter: (c) => c.hitsMax - c.hits >= healThreshold
                });
        else
            return [];
    }

    public static ThreatEvaluator = class {
        public static scoreThreatProfile(profile: ThreatProfile): number {
            return profile.attack + profile.heal + profile.rangedDamage + profile.dismantle;
        }

        public static getThreatScoreOfCreep(creep: Creep): number {
            return this.scoreThreatProfile(this.getThreatProfileOfCreep(creep));
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


