import { UnitMember } from "../../../lib/military/UnitMember";
import { Unit } from "../../../lib/military/Unit";
import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

export class Healer extends UnitMember {
    public static fromMemory(memory: UnitMemberMemory): Healer {
        let healer = new this(memory.formationPosition);
        return UnitMember.fromMemory(memory, healer) as Healer;
    }

    constructor(formationPosition: string) {
        super(UNIT_MEMBER_HEALER, BODY_HEALER, formationPosition);
    }

    public update(unit: Unit): void {
    }

    public execute(unit: Unit): void {
        let target: Creep;
        let range: number;

        for (var i = 0; i < unit.healTargets.length; i++) {
            range = this.creep.pos.getRangeTo(unit.healTargets[i]);
            if (range <= 3) {
                target = unit.healTargets[i];
                break;
            }
        }

        if (!target)
            target = MilitaryCalculator.getNearestDamagedFriendly(this.creep);
        if (!target && this.freeToMove)
            target = MilitaryCalculator.getNearestFriendly(this.creep);
                
        if (target) {
            if (!range)
                range = this.creep.pos.getRangeTo(target);

            if (range <= 1) {
                this.creep.heal(target);
                if (this.freeToMove) {
                    let dir = this.creep.pos.getDirectionTo(target);
                    this.creep.move(dir);
                }
            } else if (range <= 3) {
                this.creep.rangedHeal(target);
                if (this.freeToMove)
                    this.creep.moveTo(target);
            } else {
                if (this.freeToMove)
                    this.creep.moveTo(target);
            }
        }
    }

    public cleanup(unit: Unit): void {
    }
}
