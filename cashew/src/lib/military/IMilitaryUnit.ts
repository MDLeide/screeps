export interface IMilitaryUnit {
    attack(target: Creep | Structure): CreepActionReturnCode;
    dismantle(target: Structure): CreepActionReturnCode;
    heal(target: Creep): CreepActionReturnCode;    

    move(direction: DirectionConstant): CreepMoveReturnCode;
    moveByPath(path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS;
    moveTo(x: number, y: number, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET;
    moveTo(target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;

    rangedAttack(target: Creep | Structure): CreepActionReturnCode;
    rangedHeal(target: Creep): CreepActionReturnCode;
    rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART;
}
