import { Task } from "lib/creep/Task";
import { Job } from "lib/creep/Job";
import { Order } from "lib/empire/Exchange";

export class SupplyJob extends Job {
    public static fromMemory(memory: SupplyJobMemory): SupplyJob {
        let job = new this(
            global.empire.exchange.supplyOrders[memory.supplyOrderId],
            global.empire.exchange.demandOrders[memory.demandOrderId],
            memory.quantity);
        job.deliver = memory.deliver;
        job.preWithdrawQuantity = memory.preWithdrawQuantity;
        job.preTransferQuantity = memory.preTransferQuantity;
        return Job.fromMemory(memory, job) as SupplyJob;
    }

    constructor(supplyOrder: Order, demandOrder: Order, quantity: number) {
        super(CREEP_CONTROLLER_SUPPLY);
        this.supplyOrder = supplyOrder;
        this.supplyOrderId = supplyOrder.id;
        this.demandOrder = demandOrder;
        this.demandOrderId = demandOrder.id;
        this.quantity = quantity;
    }

    public supplyOrderId: string;
    public supplyOrder: Order;
    public demandOrderId: string;
    public demandOrder: Order;
    public quantity: number;
    public deliver: boolean;
    public preWithdrawQuantity: number;
    public preTransferQuantity: number;

    protected isCompleted(creep: Creep): boolean {
        if (!this.demandOrder || !this.supplyOrder)
            return true;

        if (this.preTransferQuantity) {
            let transfered = this.preTransferQuantity - creep.carry[this.supplyOrder.resource];
            let demandColony = global.empire.getColonyByName(this.demandOrder.colony);
            demandColony.registerDropOff(this.demandOrder.id, this.supplyOrder.id, transfered);
            this.preTransferQuantity = 0;
        }

        return this.deliver && creep.carry[this.supplyOrder.resource] == 0;
    }

    protected getNextTask(creep: Creep): Task {
        if (!this.demandOrder || !this.supplyOrder)
            return null;

        let carry = creep.carry[this.supplyOrder.resource];
        if (this.preWithdrawQuantity) {
            let withdrew = carry - this.preWithdrawQuantity;
            let supplyColony = global.empire.getColonyByName(this.supplyOrder.colony);
            supplyColony.registerPickUp(this.supplyOrderId, this.demandOrderId, withdrew);
            this.preWithdrawQuantity = 0;
        }

        if (this.preTransferQuantity) {
            let transfered = this.preTransferQuantity - carry;
            let demandColony = global.empire.getColonyByName(this.demandOrder.colony);
            demandColony.registerDropOff(this.demandOrder.id, this.supplyOrder.id, transfered);
            this.preTransferQuantity = 0;
        }

        if (!this.deliver && _.sum(creep.carry) < creep.carryCapacity && carry < this.quantity) {
            let supplyColony = global.empire.getColonyByName(this.supplyOrder.colony);
            if (!supplyColony) return null;
            let withdrawTarget = supplyColony.resourceManager.getPickupTarget(this.supplyOrder.resource);
            if (!withdrawTarget) return null;
            this.preWithdrawQuantity = carry;
            return Task.Withdraw(withdrawTarget, this.supplyOrder.resource, this.quantity - carry);
        } else {
            this.deliver = true;
            let colony = global.empire.getColonyByName(this.demandOrder.colony);
            if (!colony) return null;
            let target = colony.resourceManager.getDropoffTarget(this.demandOrder.resource);
            if (!target) return null;
            this.preTransferQuantity = creep.carry[this.demandOrder.resource];
            return Task.Transfer(target, this.demandOrder.resource);
        }         
    }
    
    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onLoad(): void {
        if (this.demandOrderId)
            this.demandOrder = global.empire.exchange.demandOrders[this.demandOrderId];
        if (this.supplyOrderId)
            this.supplyOrder = global.empire.exchange.supplyOrders[this.supplyOrderId];
        super.onLoad();
    }

    public save(): SupplyJobMemory {
        let mem = super.save() as SupplyJobMemory;
        mem.supplyOrderId = this.supplyOrderId;
        mem.demandOrderId = this.demandOrderId;
        mem.quantity = this.quantity;
        mem.deliver = this.deliver;
        mem.preWithdrawQuantity = this.preWithdrawQuantity;
        mem.preTransferQuantity = this.preTransferQuantity;
        return mem;
    }
}

export interface SupplyJobMemory extends JobMemory {
    supplyOrderId: string;
    demandOrderId: string;
    quantity: number;
    deliver: boolean;
    preWithdrawQuantity: number;
    preTransferQuantity: number;
}
