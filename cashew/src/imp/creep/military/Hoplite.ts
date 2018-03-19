import { UnitMember } from "../../../lib/military/UnitMember";
import { Unit } from "../../../lib/military/Unit";
import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

export class Hoplite extends UnitMember {
    public static fromMemory(memory: UnitMemberMemory): Hoplite {
        let hoplite = new this(memory.formationPosition);
        return UnitMember.fromMemory(memory, hoplite) as Hoplite;
    }


    constructor(formationPosition: string) {
        super(UNIT_MEMBER_HOPLITE, BODY_HOPLITE, formationPosition);
    }

    public update(unit: Unit): void {
    }

    public execute(unit: Unit): void {
        let didAttack = false;
        let didRangedAttack = false;
        let didMove = false;

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
                }
            }
            if (!didAttack) {
                if (this.creep.pos.getRangeTo(unit.attackTargets[i]) <= 1) {
                    this.creep.attack(unit.attackTargets[i]);
                    didAttack = true;
                    if (this.freeToMove) {
                        let dir = this.creep.pos.getDirectionTo(unit.attackTargets[i]);
                        didMove = this.creep.move(dir) == OK;                        
                    }
                    break;
                }
            }                
        }

        if (!didRangedAttack) {
            let target = MilitaryCalculator.getRangedAttackTarget(this.creep);
            if (target)
                this.creep.rangedAttack(target);
        }

        if (!didAttack) {
            let target = this.creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
            if (target.length) {
                this.creep.attack(target[0]);
                if (this.freeToMove) {
                    let dir = this.creep.pos.getDirectionTo(target[0]);
                    didMove = this.creep.move(dir) == OK;
                }
            }                
        }

        if (this.freeToMove && !didMove) {
            let target = MilitaryCalculator.getNearestHostile(this.creep);
            if (target)
                this.creep.moveTo(target);
        }
    }

    public cleanup(unit: Unit): void {

    }
}
