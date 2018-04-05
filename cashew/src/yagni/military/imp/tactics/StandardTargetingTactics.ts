//import { TargetingTactics } from "../../../lib/military/TargetingTactics";
//import { Squad } from "../../../lib/military/Squad";
//import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

//export class StandardTargetingTactics extends TargetingTactics {
//    constructor() {
//        super(TARGETING_TACTICS_STANDARD);
//    }

//    public getAttackTargets(unit: Squad): AttackableTarget[] {
//        if (!unit.position) return [];

//        let threats = MilitaryCalculator.getHostiles(unit.position, 10);
//        let scores: { creep: Creep, score: number }[] = [];
//        for (var i = 0; i < threats.length; i++) {
//            scores.push({
//                creep: threats[i],
//                score: MilitaryCalculator.ThreatEvaluator.getThreatScoreOfCreep(threats[i])
//            });            
//        }

//        scores.sort((a, b) => a.score - b.score);

//        return scores.map(p => p.creep);        
//    }

//    public getHealTargets(unit: Squad): Creep[] {
//        if (!unit.position) return [];

//        let damaged: { creep: Creep, dmg: number }[] = [];
//        for (var i = 0; i < unit.members.length; i++) {
//            let member = unit.members[i];
//            if (member.creep) {
//                let dmg = member.creep.hitsMax - member.creep.hits;
//                if (dmg > 0)
//                    damaged.push({ creep: member.creep, dmg: dmg });                
//            }
//        }
//        damaged.sort((a, b) => a.dmg - b.dmg);
//        return damaged.map(p => p.creep);
//    }
//}
