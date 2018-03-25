export abstract class Task {
    public static fromMemory(memory: TaskMemory, instance: Task): Task {
        instance.complete = memory.complete;
        instance.incomplete = memory.incomplete;
        instance.error = memory.error;
        instance.finished = memory.finished;
        return instance;
    }

    constructor(type: TaskType) {
        this.type = type;
    }

    public type: TaskType;

    public complete: boolean;
    public incomplete: boolean;
    public error: boolean;
    public finished: boolean;

    public save(): TaskMemory {
        let mem = this.onSave();
        if (mem)
            return mem;
        return {
            type: this.type,
            complete: this.complete,
            incomplete: this.incomplete,
            error: this.error,
            finished: this.finished
        };
    }

    protected onComplete(): void {
        this.complete = true;
        this.finished = true;
    }

    protected onIncomplete(): void {
        this.incomplete = true;
        this.finished = true;
    }

    protected onError(): void {
        this.error = true;
        this.finished = true;
    }
    
    public abstract update(creep: Creep): void;
    public abstract execute(creep: Creep): void;
    public abstract cleanup(creep: Creep): void;
    protected abstract onSave(): TaskMemory;
    
    public static loadTask(memory: TaskMemory): Task {
        switch (memory.type) {
            case TASK_ATTACK:
                return Attack.fromMemory(memory as TargetedTaskMemory);
            case TASK_BUILD:
                return Build.fromMemory(memory as TargetedTaskMemory);
            case TASK_IDLE:
                return Idle.fromMemory(memory);
            case TASK_MOVE_TO:
                return MoveTo.fromMemory(memory as MoveToMemory);
            case TASK_REPAIR:
                return Repair.fromMemory(memory as TargetedTaskMemory);
            case TASK_RESERVE:
                return Reserve.fromMemory(memory as TargetedTaskMemory);
            case TASK_TRANSFER:
                return Transfer.fromMemory(memory as TargetedTaskMemory);                       
            case TASK_UPGRADE:
                return Upgrade.fromMemory(memory as TargetedTaskMemory);
            case TASK_WITHDRAW:
                return Withdraw.fromMemory(memory as TargetedTaskMemory);
            case TASK_RESERVE:
                return Reserve.fromMemory(memory as TargetedTaskMemory);
            case TASK_CLAIM:
                return Claim.fromMemory(memory as TargetedTaskMemory);
            case TASK_HARVEST:
                return Harvest.fromMemory(memory as TargetedTaskMemory);
            case TASK_PICKUP_ENERGY:
                return PickupEnergy.fromMemory(memory as TargetedTaskMemory);
            default:
                throw new Error(`Task name ${memory.type} not recognized`)
        }
    }

    public static Idle(): Idle {
        return new Idle();
    }

    public static MoveTo(target: (RoomPosition | { pos: RoomPosition }), range?: number): MoveTo {
        return new MoveTo(target, range);
    }

    public static Transfer(target: TransferTarget): Transfer {
        return new Transfer(target);
    }

    public static Withdraw(target: WithdrawTarget): Withdraw {
        return new Withdraw(target);
    }

    public static Build(target: ConstructionSite): Build {
        return new Build(target);
    }

    public static Upgrade(target: StructureController): Upgrade {
        return new Upgrade(target);
    }

    public static Repair(target: Structure): Repair {
        return new Repair(target);
    }

    public static Attack(target: (Creep | Structure)): Attack {
        return new Attack(target);
    }

    public static Reserve(target: StructureController): Reserve {
        return new Reserve(target);
    }

    public static Claim(target: StructureController): Claim {
        return new Claim(target);
    }

    public static Harvest(target: Source): Harvest {
        return new Harvest(target);
    }

    public static PickupEnergy(target: Resource<RESOURCE_ENERGY>): PickupEnergy {
        return new PickupEnergy(target);
    }
}

export abstract class TargetedTask<T extends { id: string }> extends Task {
    public static fromMemory<TTarget extends { id: string }> (
        memory: TargetedTaskMemory,
        instance: TargetedTask<TTarget>): Task {
        
        instance.target = Game.getObjectById<TTarget>(memory.targetId);

        return Task.fromMemory(memory, instance);
    }

    constructor(type: TaskType, target: T) {
        super(type);
        this.target = target;
    }

    public target: T;

    protected onSave(): TargetedTaskMemory {
        return {
            type: this.type,
            complete: this.complete,
            incomplete: this.incomplete,
            error: this.error,
            finished: this.finished,
            targetId: this.target ? this.target.id : undefined
        };
    }
}

export class Idle extends Task {
    public static fromMemory(memory: TaskMemory): Idle {
        let idle = new this();
        return Task.fromMemory(memory, idle) as Idle;
    }

    constructor() {
        super(TASK_IDLE);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
    }

    public cleanup(creep: Creep): void {
    }

    protected onSave(): MoveToMemory {
        return null;
    }
}

export class MoveTo extends Task {
    public static fromMemory(memory: MoveToMemory): MoveTo {
        var pos = new RoomPosition(memory.x, memory.y, memory.room);
        var task = new this(pos, memory.range);
        return Task.fromMemory(memory, task) as MoveTo;
    }

    constructor(target: (RoomPosition | { pos: RoomPosition }), range?: number) {
        super(TASK_MOVE_TO);
        if (target instanceof RoomPosition)
            this.target = target;
        else
            this.target = target.pos;
        this.range = range ? range : 0;
    }


    public target: RoomPosition;
    public range: number;

    public update(creep: Creep): void {
        let distance = creep.pos.getRangeTo(this.target);
        if (distance <= this.range)
            this.onComplete();
    }

    public execute(creep: Creep): void {
        var response = creep.moveTo(this.target);
        if (response == OK)
            return;
        else if (response == ERR_NOT_OWNER)
            this.onError();
        else if (response == ERR_NO_PATH)
            this.onIncomplete();
        else if (response == ERR_BUSY)
            this.onError();
        else if (response == ERR_INVALID_TARGET)
            this.onError();
        else if (response == ERR_NO_BODYPART)
            this.onError();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {

    }

    protected onSave(): MoveToMemory {
        return {
            type: this.type,
            complete: this.complete,
            incomplete: this.incomplete,
            error: this.error,
            finished: this.finished,
            x: this.target.x,
            y: this.target.y,
            room: this.target.roomName,
            range: this.range
        };
    }
}

export interface MoveToMemory extends TaskMemory {
    range: number;
    x: number;
    y: number;
    room: string;
}

export class Transfer extends TargetedTask<TransferTarget> {
    public static fromMemory(memory: TargetedTaskMemory): Transfer {
        var target = Game.getObjectById<TransferTarget>(memory.targetId);
        var transfer = new this(target);
        return TargetedTask.fromMemory(memory, transfer) as Transfer;
    }

    constructor(target: TransferTarget) {
        super(TASK_TRANSFER, target);
    }

    public update(creep: Creep): void {
        // completes in execute loop
    }

    public execute(creep: Creep): void {
        var response = creep.transfer(this.target, RESOURCE_ENERGY);
        if (response == OK)
            this.onComplete();
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (response == ERR_NOT_OWNER)
            this.onError();
        else if (response == ERR_BUSY)
            this.onError();
        else if (response == ERR_NOT_ENOUGH_RESOURCES)
            this.onIncomplete();
        else if (response == ERR_INVALID_TARGET)
            this.onError();
        else if (response == ERR_FULL)
            this.onIncomplete();
        else if (response == ERR_INVALID_ARGS)
            this.onError();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {

    }
}

export class Withdraw extends TargetedTask<WithdrawTarget> {
    public static fromMemory(memory: TargetedTaskMemory): Withdraw {
        var target = Game.getObjectById<WithdrawTarget>(memory.targetId);
        var withdraw = new this(target);
        return TargetedTask.fromMemory(memory, withdraw) as Withdraw;
    }

    constructor(target: WithdrawTarget) {
        super(TASK_WITHDRAW, target);
    }

    public update(creep: Creep): void {
        // completes in execute loop
    }

    public execute(creep: Creep): void {
        var response = creep.withdraw(this.target, RESOURCE_ENERGY);
        if (response == OK)
            this.onComplete();
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (response == ERR_NOT_OWNER)
            this.onError();
        else if (response == ERR_BUSY)
            this.onError();
        else if (response == ERR_NOT_ENOUGH_RESOURCES)
            this.onIncomplete();
        else if (response == ERR_INVALID_TARGET)
            this.onError();
        else if (response == ERR_FULL)
            this.onIncomplete();
        else if (response == ERR_INVALID_ARGS)
            this.onError();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Build extends TargetedTask<ConstructionSite> {
    public static fromMemory(memory: TargetedTaskMemory): Build {
        var target = Game.getObjectById<ConstructionSite>(memory.targetId);
        var build = new this(target);
        return TargetedTask.fromMemory(memory, build) as Build;
    }

    constructor(target: ConstructionSite) {
        super(TASK_BUILD, target);
    }

    public update(creep: Creep): void {
        if (creep.carry.energy == 0 || !this.target)
            this.onComplete();
    }

    public execute(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        var buildResponse = creep.build(this.target);
        if (buildResponse == OK) {
            if (colony)
                colony.resourceManager.ledger.registerBuild(creep);
            return;
        }
        else if (buildResponse == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (buildResponse == ERR_NOT_OWNER)
            this.onError();
        else if (buildResponse == ERR_BUSY)
            this.onError();
        else if (buildResponse == ERR_INVALID_TARGET)
            this.onError();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Upgrade extends TargetedTask<StructureController> {
    public static fromMemory(memory: TargetedTaskMemory): Upgrade {
        var target = Game.getObjectById<StructureController>(memory.targetId);
        var upgrade = new this(target);
        return TargetedTask.fromMemory(memory, upgrade) as Upgrade;
    }

    constructor(target: StructureController) {
        super(TASK_UPGRADE, target);
    }

    public update(creep: Creep): void {
        if (creep.carry.energy == 0)
            this.onComplete();
        if (!this.target)
            this.onIncomplete();
    }

    public execute(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        var response = creep.upgradeController(this.target);
        if (response == OK) {
            if (colony)
                colony.resourceManager.ledger.registerUpgrade(creep);
            return;
        }            
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (response == ERR_NOT_OWNER)
            this.onError();
        else if (response == ERR_BUSY)
            this.onError();
        else if (response == ERR_INVALID_TARGET)
            this.onError();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Repair extends TargetedTask<Structure> {
    public static fromMemory(memory: TargetedTaskMemory): Repair {
        let target = Game.getObjectById<Structure>(memory.targetId);
        let repair = new this(target);
        return TargetedTask.fromMemory(memory, repair) as Repair;
    }

    constructor(target: Structure) {
        super(TASK_REPAIR, target);
    }

    public update(creep: Creep): void {
        if (creep.carry.energy == 0)
            return this.onComplete();
        else if (!this.target)
            return this.onError();
        else if (this.target.hits >= this.target.hitsMax)
            return this.onComplete();
    }

    public execute(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        var response = creep.repair(this.target);
        if (response == OK) {
            if (colony)
                colony.resourceManager.ledger.registerRepair(creep);
            return;
        }            
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (response == ERR_NOT_ENOUGH_RESOURCES)
            this.onIncomplete();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Attack extends TargetedTask<(Structure | Creep )> {
    public static fromMemory(memory: TargetedTaskMemory): Attack {
        let target = Game.getObjectById<(Structure | Creep)>(memory.targetId);
        let attack = new this(target);
        return TargetedTask.fromMemory(memory, attack) as Attack;
    }

    constructor(target: (Structure | Creep)) {
        super(TASK_ATTACK, target);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
        var response = creep.attack(this.target);
        if (response == OK)
            this.onComplete();
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Reserve extends TargetedTask<StructureController> {
    public static fromMemory(memory: TargetedTaskMemory): Reserve {
        let target = Game.getObjectById<StructureController>(memory.targetId);
        let reserve = new this(target);
        return TargetedTask.fromMemory(memory, reserve) as Reserve;
    }

    constructor(target: StructureController) {
        super(TASK_RESERVE, target);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
        let response = creep.reserveController(this.target);
        if (response == OK)
            return;
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Claim extends TargetedTask<StructureController> {
    public static fromMemory(memory: TargetedTaskMemory): Claim {
        let target = Game.getObjectById<StructureController>(memory.targetId);
        let claim = new this(target);
        return TargetedTask.fromMemory(memory, claim) as Claim;
    }

    constructor(target: StructureController) {
        super(TASK_CLAIM, target);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
        let response = creep.claimController(this.target);
        if (response == OK)
            this.onComplete();
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {
    }
}

export class Harvest extends TargetedTask<Source> {
    public static fromMemory(memory: TargetedTaskMemory): Harvest {
        let target = Game.getObjectById<Source>(memory.targetId);
        let harvest = new this(target);
        return TargetedTask.fromMemory(memory, harvest) as Harvest;
    }

    constructor(target: Source) {
        super(TASK_CLAIM, target);
    }

    public update(creep: Creep): void {
        if (_.sum(creep.carry) == creep.carryCapacity)
            this.onComplete();
    }

    public execute(creep: Creep): void {
        let response = creep.harvest(this.target);
        if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
    }

    public cleanup(creep: Creep): void {
    }
}

export class PickupEnergy extends TargetedTask<Resource<RESOURCE_ENERGY>> {
    public static fromMemory(memory: TargetedTaskMemory): PickupEnergy {
        let target = Game.getObjectById<Resource<RESOURCE_ENERGY>>(memory.targetId);
        let pickup = new this(target);
        return TargetedTask.fromMemory(memory, pickup) as PickupEnergy;
    }

    constructor(target: Resource<RESOURCE_ENERGY>) {
        super(TASK_PICKUP_ENERGY, target);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
        let response = creep.pickup(this.target);
        if (response == OK)
            this.onComplete();
        else if (response == ERR_NOT_IN_RANGE)
            creep.moveTo(this.target);
        else if (response == ERR_NOT_OWNER)
            this.onError();
        else if (response == ERR_BUSY)
            this.onError();
        else if (response == ERR_INVALID_TARGET)
            this.onError();
        else if (response == ERR_FULL)
            this.onIncomplete();
        else
            this.onError();
    }

    public cleanup(creep: Creep): void {        
    }
}
