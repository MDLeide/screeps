import { CreepController } from "../../lib/creep/CreepController";
import { MilitaryCalculator } from "../../lib/util/MilitaryCalculator";


/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class DefenderController extends CreepController {
    public static fromMemory(memory: CreepControllerMemory): CreepController {
        let upgrader = new this();
        return CreepController.fromMemory(memory, upgrader);
    }


    constructor() {
        super(CREEP_CONTROLLER_DEFENDER);
    }
       

    protected onLoad(): void {
    }
    

    protected onUpdate(creep: Creep): void {
        let didHeal = false;
        let didRangedHeal = false;

        let healParts = creep.getActiveBodyparts(HEAL);
        if (healParts > 0) {
            if (creep.hits <= creep.hitsMax - healParts * HEAL_POWER) {
                creep.heal(creep);
                didHeal = true;
            } else {
                let nearby = creep.pos.findInRange(
                    FIND_MY_CREEPS,
                    3,
                    { filter: (c) => c.hits <= c.hitsMax - healParts * HEAL_POWER });
                if (nearby.length) {
                    if (nearby[0].pos.getRangeTo(creep) == 1) {
                        creep.heal(nearby[0]);
                        didHeal = true;
                    } else {
                        creep.rangedHeal(nearby[0]);
                        didRangedHeal = true;
                    }                        
                }
            }
        }

        let colony = global.empire.getCreepsColony(creep);
        let atkTarget = colony.watchtower.attackTarget;                

        if (!didHeal && !didRangedHeal && creep.getActiveBodyparts(ATTACK) > 0) {
            if (atkTarget && atkTarget.pos.getRangeTo(creep) <= 1) {
                creep.attack(atkTarget);
            } else {
                let nearbyTargets = creep.pos.findInRange(
                    FIND_HOSTILE_CREEPS,
                    1);
                if (nearbyTargets.length) {
                    creep.attack(nearbyTargets[0]);
                }
            }
        }
                        
        if (!didRangedHeal && creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
            let rangedMassDamage = MilitaryCalculator.getRangedMassAttackDamage(creep);
            if (rangedMassDamage > 10) {
                creep.rangedMassAttack();
            } else {
                if (atkTarget && atkTarget.pos.getRangeTo(creep) <= 3) {
                    creep.rangedAttack(atkTarget);
                } else {
                    let rangedAttackTarget = MilitaryCalculator.getRangedAttackTarget(creep);
                    if (rangedAttackTarget)
                        creep.rangedAttack(rangedAttackTarget);
                }
            }
        }

        if (atkTarget)
            creep.moveTo(atkTarget);
    }


    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onSave(): CreepControllerMemory {
        return null;
    }
}
