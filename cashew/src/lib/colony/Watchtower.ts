import { Colony } from "./Colony";
import { ThreatEvaluator } from "../creep/CreepUtility";

export class Watchtower {
    public static fromMemory(memory: WatchtowerMemory): Watchtower {
        let watchtower = new this();
        watchtower.threatScore = memory.threatScore;
        watchtower.attackTargetId = memory.attackTargetId;
        watchtower.healTargetName = memory.healTargetName;
        return watchtower;
    }

    public threatScore: number;
    public attackTargetId: string;
    public healTargetName: string;

    public attackTarget: Creep;
    public healTarget: Creep;

    public load(): void {
        if (this.attackTargetId) {
            this.attackTarget = Game.getObjectById<Creep>(this.attackTargetId);
            if (!this.attackTarget)
                this.attackTargetId = null;
        }
            
        if (this.healTargetName)
            this.healTarget = Game.creeps[this.healTargetName];
    }

    public update(colony: Colony): void {
        if (!this.attackTarget) {
            this.analyzeThreats(colony);
        }

        if (this.healTarget) {
            if (this.healTarget.hits >= this.healTarget.hitsMax - 15) {
                this.healTargetName = null;
                this.healTarget = null;
            }
        }
        if (!this.healTarget)
            this.analyzeFriendlies(colony);
    }

    public execute(colony: Colony): void {

    }

    public cleanup(colony: Colony): void {
        
    }

    private analyzeFriendlies(colony: Colony): void {
        let healTargets = colony.nest.room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax - 35
        });

        let highDamage = 0;
        for (var i = 0; i < healTargets.length; i++) {
            let damage = healTargets[i].hitsMax - healTargets[i].hits;
            if (damage > highDamage) {
                highDamage = damage;
                this.healTarget = healTargets[i];
                this.healTargetName = healTargets[i].name;
            }
        }
    }

    private analyzeThreats(colony: Colony): void {
        let hostiles = colony.nest.room.find(FIND_HOSTILE_CREEPS);

        this.threatScore = 0;

        let highHeal: number = 0;
        let highAttack: number = 0;
        let highDismantle: number = 0;

        for (var i = 0; i < hostiles.length; i++) {
            let threat = ThreatEvaluator.getThreatProfileOfCreep(hostiles[i]);
            this.threatScore += ThreatEvaluator.scoreThreatProfile(threat);

            if (threat.heal > highHeal) {
                highHeal = threat.heal;
                this.attackTarget = hostiles[i];
            } else if (highHeal == 0 && (threat.attack >= highAttack || threat.rangedDamage >= highAttack)) {
                highAttack = Math.max(threat.attack, threat.rangedDamage);
                this.attackTarget = hostiles[i];
            } else if (highHeal == 0 && highAttack == 0 && threat.dismantle > highDismantle) {
                highDismantle = threat.dismantle;
                this.attackTarget = hostiles[i];
            }
        }

        if (!this.attackTarget && hostiles.length)
            this.attackTarget = hostiles[0];

        if (this.attackTarget)
            this.attackTargetId = this.attackTarget.id;
    }

    public save(): WatchtowerMemory {
        return {
            attackTargetId: this.attackTargetId,
            healTargetName: this.healTargetName,
            threatScore: this.threatScore
        }
    }
}
