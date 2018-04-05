//import { SquadMember } from "../../../lib/military/SquadMember";
//import { Squad } from "../../../lib/military/Squad";
//import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

//export class Healer extends SquadMember {
//    public static fromMemory(memory: UnitMemberMemory): Healer {
//        let healer = new this(memory.formationPosition);
//        return SquadMember.fromMemory(memory, healer) as Healer;
//    }

//    constructor(formationPosition: string) {
//        super(UNIT_MEMBER_HEALER, BODY_HEALER, formationPosition);
//    }

//    public update(unit: Squad): void {
//    }

//    public execute(unit: Squad): void {
//        let target: Creep;
//        let range: number;

//        for (var i = 0; i < unit.healTargets.length; i++) {
//            range = this.creep.pos.getRangeTo(unit.healTargets[i]);
//            if (range <= 3) {
//                target = unit.healTargets[i];
//                break;
//            }
//        }

//        if (!target)
//            target = MilitaryCalculator.getNearestDamagedFriendly(this.creep);
//        if (!target && this.freeToMove)
//            target = MilitaryCalculator.getNearestFriendly(this.creep);
                
//        if (target) {
//            if (!range)
//                range = this.creep.pos.getRangeTo(target);

//            if (range <= 1) {
//                this.creep.heal(target);
//                if (this.freeToMove) {
//                    let dir = this.creep.pos.getDirectionTo(target);
//                    this.creep.move(dir);
//                }
//            } else if (range <= 3) {
//                this.creep.rangedHeal(target);
//                if (this.freeToMove)
//                    this.creep.moveTo(target);
//            } else {
//                if (this.freeToMove)
//                    this.creep.moveTo(target);
//            }
//        }
//    }

//    public cleanup(unit: Squad): void {
//    }
//}
