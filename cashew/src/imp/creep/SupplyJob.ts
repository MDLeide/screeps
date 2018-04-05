import { Task } from "lib/creep/Task";
import { Job } from "lib/creep/Job";
import { Order, Transaction } from "lib/empire/Exchange";

export class SupplyJob extends Job {
    public static fromMemory(memory: SupplyJobMemory): SupplyJob {
        let job = Object.create(SupplyJob.prototype) as SupplyJob;
        job.transactionId = memory.transactionId;
        job.quantity = memory.quantity;
        job.deliver = memory.deliver;
        job.preWithdrawQuantity = memory.preWithdrawQuantity;
        job.preTransferQuantity = memory.preTransferQuantity;
        job.withdraw = memory.withdraw;
        job.complete = memory.complete;
        return Job.fromMemory(memory, job) as SupplyJob;
    }

    constructor(transaction: Transaction, quantity: number) {
        super(CREEP_CONTROLLER_SUPPLY);
        this.transaction = transaction;
        this.quantity = quantity;
    }

    public transaction: Transaction;
    public transactionId: string;
    public quantity: number;
    public deliver: boolean;
    public preWithdrawQuantity: number;
    public preTransferQuantity: number;
    public withdraw: boolean;
    public complete: boolean;

    protected isCompleted(creep: Creep): boolean {
        if (!this.transaction) return true;
        return this.complete;
    }

    protected getNextTask(creep: Creep): Task {
        if (!this.transaction)
            return null;

        let carry = creep.carry[this.transaction.resource];
        if (!carry) carry = 0;
        if (this.withdraw) {
            let withdrew = carry - this.preWithdrawQuantity;
            let supplyColony = global.empire.getColonyByName(this.transaction.supplyOrder.colony);
            supplyColony.registerPickUp(this.transaction.resource, withdrew);
            this.transaction.pickUp(withdrew);
            this.preWithdrawQuantity = 0;
            this.withdraw = false;
        }

        if (this.preTransferQuantity) {
            let transfered = this.preTransferQuantity - carry;
            let demandColony = global.empire.getColonyByName(this.transaction.demandOrder.colony);
            demandColony.registerDelivery(this.transaction.resource, transfered);
            this.transaction.deliver(transfered);
            this.preTransferQuantity = 0;
            this.complete = true;
        }

        if (!this.deliver && _.sum(creep.carry) < creep.carryCapacity && carry < this.quantity) {
            let supplyColony = global.empire.getColonyByName(this.transaction.supplyOrder.colony);
            if (!supplyColony) return null;
            let withdrawTarget = supplyColony.resourceManager.getPickupTarget(this.transaction.resource);
            if (!withdrawTarget) return null;
            this.preWithdrawQuantity = carry;
            this.withdraw = true;
            return Task.Withdraw(withdrawTarget, this.transaction.resource, this.quantity - carry);
        } else {
            this.deliver = true;
            let colony = global.empire.getColonyByName(this.transaction.demandOrder.colony);
            if (!colony) return null;
            let target = colony.resourceManager.getDropoffTarget(this.transaction.resource);
            if (!target) return null;
            this.preTransferQuantity = creep.carry[this.transaction.resource];
            return Task.Transfer(target, this.transaction.resource);
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
        this.transaction = global.empire.exchange.transactions[this.transactionId];
        super.onLoad();
    }

    public save(): SupplyJobMemory {
        let mem = super.save() as SupplyJobMemory;
        mem.transactionId = this.transaction ? this.transaction.id : undefined;
        mem.quantity = this.quantity;
        mem.deliver = this.deliver;
        mem.preWithdrawQuantity = this.preWithdrawQuantity;
        mem.preTransferQuantity = this.preTransferQuantity;
        mem.withdraw = this.withdraw;
        mem.complete = this.complete;
        return mem;
    }
}

export interface SupplyJobMemory extends JobMemory {
    transactionId: string;
    quantity: number;
    deliver: boolean;
    preWithdrawQuantity: number;
    preTransferQuantity: number;
    withdraw: boolean;
    complete: boolean;
}
