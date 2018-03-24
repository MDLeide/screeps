import { ColonyDefenseMonitor } from "../imp/colony/militaryMonitors/ColonyDefenseMonitor";
import { ObserverConstructionOperation } from "../imp/operation/infrastructure/ObserverConstructionOperation";
import { ExtensionFillOperation } from "../imp/operation/economic/ExtensionFillOperation";
import { ReplaceOriginalSpawnOperation } from "../imp/operation/infrastructure/ReplaceOriginalSpawnOperation";
import { Empire } from "../lib/empire/Empire";
import { BodyRepository } from "../imp/creep/BodyRepository";
import { Assignment } from "../lib/operation/Assignment";

export class Test {
    public recycleNearestCreeps(spawn?: (StructureSpawn | string)): string {
        if (spawn) {
            return this.recycleNearestCreeps(global.empire.colonies[0].nest.spawners[0].spawn);
        } else if (spawn instanceof StructureSpawn) {
            let creeps = spawn.pos.findInRange(FIND_CREEPS, 1);
            for (var i = 0; i < creeps.length; i++)
                spawn.recycleCreep(creeps[i]);
            
            return `Recycled ${creeps.length} creeps`;
        } else {
            return this.recycleNearestCreeps(Game.spawns[spawn]);
        }
    }

    public test(): string {
        if (!global.empire)
            global.empire = new Empire(null);
                
        Memory.empire = global.empire.save();
        //return this.addFillOperation();
        //this.addUpgrader();
        return "";
    }

    //private addUpgrader(): void {
    //    let col = global.empire.colonies[0];
    //    let mem = [];
    //    for (var i = 0; i < col.operationPlans.length; i++) {
    //        if (col.operationPlans[i].type == PLAN_ECONOMY) {
    //            let plan = col.operationPlans[i];
    //            console.log(plan.type);

    //            for (var j = 0; j < plan.operationGroup.operations.length; j++) {
    //                let currentOp = plan.operationGroup.operations[j];
    //                if (currentOp.type == OPERATION_HEAVY_UPGRADE) {
    //                    console.log(currentOp.type);

    //                    let body = BodyRepository.heavyUpgrader();
    //                    body.maxCompleteScalingSections = 12;
    //                    currentOp.assignments.push(new Assignment("", body, CREEP_CONTROLLER_UPGRADER, 50));
    //                }
    //            }                
    //        }
    //        mem.push(col.operationPlans[i].save());
    //    }
    //    Memory.empire.colonies['Colony W1N7'].operationPlans = mem;   
    //}

    //private resetReplaceSpawn(): void {
    //    let col = global.empire.colonies[0];
    //    let mem = [];
    //    for (var i = 0; i < col.operationPlans.length; i++) {
    //        if (col.operationPlans[i].type == PLAN_INFRASTRUCTURE) {
    //            let plan = col.operationPlans[i];

    //            for (var j = 0; j < plan.operationGroup.operations.length; j++) {
    //                let currentOp = plan.operationGroup.operations[j];
    //                if (currentOp.type == OPERATION_REPLACE_ORIGINAL_SPAWN) {
    //                    currentOp.finish(col);
    //                    plan.operationGroup.operations.splice(j--, 1);
    //                }
    //            }

    //            let op = new ReplaceOriginalSpawnOperation();
    //            plan.operationGroup.addOperation(op);
    //        }
    //        mem.push(col.operationPlans[i].save());
    //    }
    //    Memory.empire.colonies['Colony W1N7'].operationPlans = mem;        
    //}

    //private addFillOperation(): string {
    //    let col = global.empire.colonies[0];
    //    let mem = [];

    //    for (var i = 0; i < col.operationPlans.length; i++) {
    //        if (col.operationPlans[i].type == PLAN_ECONOMY) {
    //            let plan = col.operationPlans[i];

    //            for (var j = 0; j < plan.operationGroup.operations.length; j++) {
    //                let currentOp = plan.operationGroup.operations[j];
    //                if (currentOp.type == OPERATION_EXTENSION_FILL)
    //                    plan.operationGroup.operations.splice(j--, 1);
    //            }

    //            let op = new ExtensionFillOperation();
    //            plan.operationGroup.addOperation(op);
    //        }
    //        mem.push(col.operationPlans[i].save());
    //    }
    //    Memory.empire.colonies['Colony W1N7'].operationPlans = mem;
    //    return "";
    //}
}
