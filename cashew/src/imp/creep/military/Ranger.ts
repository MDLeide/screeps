import { UnitMember } from "../../../lib/military/UnitMember";
import { Unit } from "../../../lib/military/Unit";
import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

export class Ranger extends UnitMember {
    public static fromMemory(memory: UnitMemberMemory): Ranger {
        let ranger = new this(memory.formationPosition);
        return UnitMember.fromMemory(memory, ranger) as Ranger;
    }


    constructor(formationPosition: string) {
        super(UNIT_MEMBER_RANGER, BODY_RANGER, formationPosition);
    }

    public update(unit: Unit): void {
    }

    public execute(unit: Unit): void {
        let didRangedAttack = false;

        let massAttackDamage = MilitaryCalculator.getRangedMassAttackDamage(this.creep);
        if (massAttackDamage > 10) {
            this.creep.rangedMassAttack();
            didRangedAttack = true;
        }

        for (var i = 0; i < unit.attackTargets.length; i++) {
            if (!didRangedAttack) {
                if (this.creep.pos.getRangeTo(unit.attackTargets[i]) <= 3) {
                    this.creep.rangedAttack(unit.attackTargets[i]);
                    didRangedAttack = true;
                    break;
                }
            }
        }

        if (!didRangedAttack) {
            let target = MilitaryCalculator.getRangedAttackTarget(this.creep);
            if (target)
                this.creep.rangedAttack(target);
        }

        if (this.freeToMove) {
            let nearestHostile = MilitaryCalculator.getNearestHostile(this.creep);
            if (nearestHostile) {
                let range = this.creep.pos.getRangeTo(nearestHostile);
                if (range <= 2) {
                    let path = PathFinder.search(
                        this.creep.pos,
                        { pos: nearestHostile.pos, range: 3 },
                        { flee: true });
                    this.creep.moveByPath(path.path);
                } else if (range > 3) {
                    this.creep.moveTo(nearestHostile);
                }
            }
        }
    }

    public cleanup(unit: Unit): void {
    }
}
