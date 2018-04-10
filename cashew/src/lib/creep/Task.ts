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

    /** True if the task completed successfuly. */
    public complete: boolean;
    /** True if the task could not finish. */
    public incomplete: boolean;
    /** True if an error occured. */
    public error: boolean;
    /** True if the task is no longer running, for any reason. */
    public finished: boolean;

    public toString(): string {
        let status = "";
        if (this.complete)
            status = "finished (complete)";
        else if (this.incomplete)
            status = "finished (incomplete)";
        else if (this.error)
            status = "finished (error)";
        else
            status = "running";
        return `Task ${this.type}: ${status}`;
    }

    public save(): TaskMemory {
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
                return Transfer.fromMemory(memory as TransferTaskMemory);                       
            case TASK_UPGRADE:
                return Upgrade.fromMemory(memory as TargetedTaskMemory);
            case TASK_WITHDRAW:
                return Withdraw.fromMemory(memory as WithdrawTaskMemory);
            case TASK_RESERVE:
                return Reserve.fromMemory(memory as TargetedTaskMemory);
            case TASK_CLAIM:
                return Claim.fromMemory(memory as TargetedTaskMemory);
            case TASK_HARVEST:
                return Harvest.fromMemory(memory as TargetedTaskMemory);
            case TASK_PICKUP_ENERGY:
                return PickupEnergy.fromMemory(memory as TargetedTaskMemory);
            case TASK_DISMANTLE:
                return Dismantle.fromMemory(memory as TargetedTaskMemory);
            case TASK_HEAL:
                return Heal.fromMemory(memory as TargetedTaskMemory);
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

    public static Transfer(target: TransferTarget, resource: ResourceConstant = RESOURCE_ENERGY, quantity?: number): Transfer {
        return new Transfer(target, resource, quantity);
    }

    public static Withdraw(target: WithdrawTarget, resource: ResourceConstant = RESOURCE_ENERGY, quantity?: number): Withdraw {
        return new Withdraw(target, resource, quantity);
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

    public static Dismantle(target: Structure): Dismantle {
        return new Dismantle(target);
    }

    public static Heal(target: Creep): Heal {
        return new Heal(target);
    }
}

export abstract class TargetedTask<T extends { id: string }> extends Task {
    public static fromMemory<TTarget extends { id: string }> (memory: TargetedTaskMemory, instance: TargetedTask<TTarget>): Task {
        
        instance.target = Game.getObjectById<TTarget>(memory.targetId);

        return Task.fromMemory(memory, instance);
    }

    constructor(type: TaskType, target: T) {
        super(type);
        this.target = target;
    }

    public target: T;

    public save(): TargetedTaskMemory {
        let mem = super.save() as TargetedTaskMemory;
        mem.targetId = this.target ? this.target.id : undefined;
        return mem;
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

    public save(): MoveToMemory {
        let mem = super.save() as MoveToMemory;
        mem.range = this.range;
        mem.x = this.target.x;
        mem.y = this.target.y;
        mem.room = this.target.roomName;
        return mem;
    }
}

export interface MoveToMemory extends TaskMemory {
    range: number;
    x: number;
    y: number;
    room: string;
}

export class Transfer extends TargetedTask<TransferTarget> {
    public static fromMemory(memory: TransferTaskMemory): Transfer {
        var target = Game.getObjectById<TransferTarget>(memory.targetId);
        var transfer = new this(target);
        transfer.resource = memory.resource ? memory.resource : RESOURCE_ENERGY;
        transfer.quantity = memory.quantity;
        return TargetedTask.fromMemory(memory, transfer) as Transfer;
    }

    constructor(target: TransferTarget, resource: ResourceConstant = RESOURCE_ENERGY, quantity?: number) {
        super(TASK_TRANSFER, target);
        this.quantity = quantity;
        this.resource = resource;
    }

    public resource: ResourceConstant;
    public quantity: number;

    public update(creep: Creep): void {
        // completes in execute loop
    }

    public execute(creep: Creep): void {
        var response = creep.transfer(this.target, this.resource, this.quantity);
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

    public save(): TargetedTaskMemory {
        let mem = super.save() as TransferTaskMemory;
        mem.resource = this.resource;
        mem.quantity = this.quantity;
        return mem;
    }
}

export interface TransferTaskMemory extends TargetedTaskMemory {
    resource: ResourceConstant;
    quantity: number;
}

export class Withdraw extends TargetedTask<WithdrawTarget> {
    public static fromMemory(memory: WithdrawTaskMemory): Withdraw {
        var target = Game.getObjectById<WithdrawTarget>(memory.targetId);
        var withdraw = new this(target);
        withdraw.resource = memory.resource ? memory.resource : RESOURCE_ENERGY;
        withdraw.quantity = memory.quantity;
        return TargetedTask.fromMemory(memory, withdraw) as Withdraw;
    }

    public resource: ResourceConstant;
    public quantity: number;

    constructor(target: WithdrawTarget, resource: ResourceConstant = RESOURCE_ENERGY, quantity?: number) {
        super(TASK_WITHDRAW, target);
        this.resource = resource;
        this.quantity = quantity;
    }

    public update(creep: Creep): void {
        // completes in execute loop
    }

    public execute(creep: Creep): void {
        var response = creep.withdraw(this.target, this.resource, this.quantity);
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

    public save(): WithdrawTaskMemory {
        let mem = super.save() as WithdrawTaskMemory;
        mem.resource = this.resource;
        mem.quantity = this.quantity;
        return mem;
    }
}

export interface WithdrawTaskMemory extends TargetedTaskMemory {
    resource: ResourceConstant;
    quantity: number;
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
        if (!this.target)
            return this.onComplete();
    }

    public execute(creep: Creep): void {
        creep.attack(this.target);
        creep.moveTo(this.target);
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
        super(TASK_HARVEST, target);
    }

    public update(creep: Creep): void {
        if (_.sum(creep.carry) == creep.carryCapacity || this.target.energy == 0)
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

export class Dismantle extends TargetedTask<Structure> {
    public static fromMemory(memory: TargetedTaskMemory): Dismantle {
        let target = Game.getObjectById<Structure>(memory.targetId);
        let dismantle = new this(target);
        return TargetedTask.fromMemory(memory, dismantle) as Dismantle;
    }

    constructor(target: Structure) {
        super(TASK_DISMANTLE, target);
    }

    public update(creep: Creep): void {
    }

    public execute(creep: Creep): void {
        if (!this.target)
            this.onComplete();

        let response = creep.dismantle(this.target);
        if (response == OK)
            return;
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

export class Heal extends TargetedTask<Creep> {
    public static fromMemory(memory: TargetedTaskMemory): Heal {
        let target = Game.getObjectById<Creep>(memory.targetId);
        let heal = new this(target);
        return TargetedTask.fromMemory(memory, heal) as Heal;
    }

    constructor(target: Creep) {
        super(TASK_HEAL, target);
    }

    public update(creep: Creep): void {
        if (!this.target || this.target.hits >= this.target.hitsMax)
            this.onComplete();
    }

    public execute(creep: Creep): void {
        let range = creep.pos.getRangeTo(this.target);
        if (range <= 1)
            creep.heal(this.target);
        else if (range <= 3)
            creep.rangedHeal(this.target);
        creep.moveTo(this.target);
    }

    public cleanup(creep: Creep): void {
    }
}
