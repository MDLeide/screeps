import { Util } from "../util/Util";

export class UCreep {
    /**
     * Attemps to swap positions with a creep.
     * @param creep
     */
    public swap(creepA: Creep, creepB: Creep): boolean {
        if (creepA.pos.getRangeTo(creepB) > 1)
            return false;

        var moveA = creepA.pos.getDirectionTo(creepB);
        var moveB = creepB.pos.getDirectionTo(creepA);

        var resultA = creepA.move(moveA);
        if (resultA != OK)
            return false;

        var resultB = creepB.move(moveB);
        return resultB == OK;
    }
}

//export class WCreep {
//    public move(creep: Creep, direction: DirectionConstant): CreepMoveReturnCode {
//        return creep.move(direction);
//    }

//    public moveByPath(creep: Creep, path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
//        return creep.moveByPath(path);
//    }
        
//    public moveTo(creep: Creep, target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
//        return creep.moveTo(target, opts);
//    }
//}

//export class WCreep {
//    public attack(creep: Creep, target: Creep | Structure): CreepActionReturnCode {
//        return creep.attack(target);
//    }

//    public attackController(creep: Creep, target: StructureController): CreepActionReturnCode {
//        return creep.attackController(target);
//    }

//    public build(creep: Creep, target: ConstructionSite): CreepActionReturnCode | ERR_RCL_NOT_ENOUGH {
//        return creep.build(target);
//    }

//    public cancelOrder(creep: Creep, methodName: string): OK | ERR_NOT_FOUND {
//        return creep.cancelOrder(methodName);
//    }

//    public claimController(creep: Creep, target: StructureController): CreepActionReturnCode | ERR_FULL | ERR_RCL_NOT_ENOUGH {
//        return creep.claimController(target);
//    }

//    public dismantle(creep: Creep, target: Structure): CreepActionReturnCode {
//        return creep.dismantle(target);
//    }

//    public drop(creep: Creep, resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {

//    }

//    public generateSafeMode(creep: Creep, target: StructureController): CreepActionReturnCode {

//    }

//    public getActiveBodyparts(creep: Creep, type: BodyPartConstant): number {

//    }

//    public harvest(creep: Creep, target: Source | Mineral): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {

//    }

//    public heal(creep: Creep, target: Creep): CreepActionReturnCode {

//    }

//    public move(creep: Creep, direction: DirectionConstant): CreepMoveReturnCode {

//    }

//    public moveByPath(creep: Creep, path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {

//    }

//    public moveTo(creep: Creep, target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
//    public moveTo(creep: Creep, x: number, y: number, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET {

//    }

//    public notifyWhenAttacked(creep: Creep, enabled: boolean): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS {

//    }

//    public pickup(creep: Creep, target: Resource): CreepActionReturnCode | ERR_FULL {

//    }

//    public rangedAttack(creep: Creep, target: Creep | Structure): CreepActionReturnCode {

//    }

//    public rangedHeal(creep: Creep, target: Creep): CreepActionReturnCode {

//    }

//    public rangedMassAttack(creep: Creep, ): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {

//    }

//    public repair(creep: Creep, target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES {

//    }

//    public reserveController(creep: Creep, target: StructureController): CreepActionReturnCode {

//    }

//    public say(creep: Creep, message: string, toPublic?: boolean): OK | ERR_NOT_OWNER | ERR_BUSY {

//    }

//    public signController(creep: Creep, target: StructureController, text: string): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {

//    }

//    public suicide(creep: Creep, ): OK | ERR_NOT_OWNER | ERR_BUSY {

//    }

//    public transfer(creep: Creep, target: Creep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {

//    }

//    public upgradeController(creep: Creep, target: StructureController): ScreepsReturnCode {

//    }

//    public withdraw(creep: Creep, target: Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {

//    }
//}
