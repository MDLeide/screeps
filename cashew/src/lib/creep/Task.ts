export abstract class Task {
    public static fromMemory<T extends Task>(memory: TaskMemory, instance: T): T {
        instance.complete = memory.complete;
        instance.incomplete = memory.incomplete;
        instance.error = memory.error;
        instance.finished = memory.finished;
        return instance;
    }

    constructor(name: string) {
        this.name = name;
    }

    public name: string;

    public complete: boolean;
    public incomplete: boolean;
    public error: boolean;
    public finished: boolean;

    public save(): TaskMemory {
        let mem = this.onSave();
        if (mem)
            return mem;
        return {
            name: this.name,
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
        switch (memory.name) {
            case "Move":
                return MoveTo.fromMemory(memory as MoveToMemory);
            case "Idle":
                return Idle.fromMemory(memory);
            case "Transfer":
                return Transfer.fromMemory(memory as TargetedTaskMemory);
            case "Withdraw":
                return Withdraw.fromMemory(memory as TargetedTaskMemory);
            case "Build":
                return Build.fromMemory(memory as TargetedTaskMemory);
            default:
                throw new Error(`Task name ${memory.name} not recognized`)
        }
    }

    public static readonly IdleName = "Idle";
    public static readonly MoveToName = "MoveTo";
    public static readonly TransferName = "Transfer";
    public static readonly WithdrawName = "Withdraw";
    public static readonly BuildName = "Build";
    public static readonly UpgradeName = "Upgrade";

    public static Idle(): Idle {
        return new Idle();
    }

    public static MoveTo(target: (RoomPosition | { pos: RoomPosition })): MoveTo {
        return new MoveTo(target);
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
}

export abstract class TargetedTask<T extends { id: string }> extends Task {
    public static fromMemory<TTarget extends { id: string }, TInstance extends TargetedTask<TTarget>>(memory: TargetedTaskMemory, instance: TInstance): TInstance {
        return Task.fromMemory(memory, instance);
    }

    constructor(name: string, target: T) {
        super(name);
        this.target = target;
    }

    public target: T;

    protected onSave(): TargetedTaskMemory {
        return {
            name: this.name,
            complete: this.complete,
            incomplete: this.incomplete,
            error: this.error,
            finished: this.finished,
            targetId: this.target.id
        };
    }
}

export class Idle extends Task {
    public static fromMemory(memory: TaskMemory): Idle {
        let idle = new this();
        return Task.fromMemory(memory, idle);
    }

    constructor() {
        super("Idle");
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
        return Task.fromMemory(memory, task);
    }

    constructor(target: (RoomPosition | { pos: RoomPosition }), range?: number) {
        super(Task.MoveToName);
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
            name: this.name,
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
        return TargetedTask.fromMemory(memory, transfer);
    }

    constructor(target: TransferTarget) {
        super(Task.TransferName, target);
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
        return TargetedTask.fromMemory(memory, withdraw);
    }

    constructor(target: WithdrawTarget) {
        super(Task.WithdrawName, target);
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
        var withdraw = new this(target);
        return TargetedTask.fromMemory(memory, withdraw);
    }

    constructor(target: ConstructionSite) {
        super(Task.BuildName, target);
    }

    public update(creep: Creep): void {
        if (creep.carry.energy == 0 || !this.target)
            this.onComplete();
    }

    public execute(creep: Creep): void {
        var response = creep.build(this.target);
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

export class Upgrade extends TargetedTask<StructureController> {
    public static fromMemory(memory: TargetedTaskMemory): Upgrade {
        var target = Game.getObjectById<StructureController>(memory.targetId);
        var upgrade = new this(target);
        return TargetedTask.fromMemory(memory, upgrade);
    }

    constructor(target: StructureController) {
        super(Task.UpgradeName, target);
    }

    public update(creep: Creep): void {
        if (creep.carry.energy == 0)
            this.onComplete();
        if (!this.target)
            this.onIncomplete();
    }

    public execute(creep: Creep): void {
        var response = creep.upgradeController(this.target);
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
