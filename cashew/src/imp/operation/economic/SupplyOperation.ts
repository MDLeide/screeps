import { JobOperation } from "lib/operation/JobOperation";
import { Assignment } from "lib/operation/Assignment";
import { Job } from "lib/creep/Job";
import { Colony } from "lib/colony/Colony";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { Order, Transaction } from "lib/empire/Exchange";
import { SupplyJob } from "../../creep/SupplyJob";
import { BodyRepository } from "../../creep/BodyRepository";

export class SupplyOperation extends JobOperation {
    public static fromMemory(memory: SupplyOperationMemory): SupplyOperation {
        let op = Object.create(SupplyOperation.prototype) as SupplyOperation;        
        op.transactionId = memory.transactionId;
        op.quantity = memory.quantity;
        op.quantityAssigned = memory.quantityAssigned;
        return JobOperation.fromMemory(memory, op) as SupplyOperation;
    }

    constructor(transaction: Transaction) {
        super(OPERATION_SUPPLY, []);

        this.transaction = transaction;
        this.transactionId = transaction.id;
        this.quantity = transaction.quantity;
    }

    public transaction: Transaction;
    public transactionId: string;
    public get demandOrder(): Order { return this.transaction.demandOrder; }
    public get supplyOrder(): Order { return this.transaction.supplyOrder; }
    public quantity: number;
    public quantityAssigned: number = 0;

    protected getJob(assignment: Assignment): Job {
        if (this.quantityAssigned == this.quantity) return null;
        let creep = Game.creeps[assignment.creepName];
        if (!creep) return null;
        let assign = Math.min(this.quantity - this.quantityAssigned, creep.carryCapacity);
        this.quantityAssigned += assign;
        return new SupplyJob(this.transaction, assign);
    }


    public isFinished(colony: Colony): boolean {
        if (this.transaction.complete)
            return true;

        if (this.quantityAssigned < this.quantity)
            return false;        

        for (var i = 0; i < this.assignments.length; i++) {
            if (!this.assignments[i].creepName) continue;
            let creep = Game.creeps[this.assignments[i].creepName];
            if (!creep) continue;
            let job = this.jobs[creep.name] as SupplyJob;
            if (!job) continue;
            if (!job.deliver || creep.carry[this.supplyOrder.resource])
                return false; // we have creeps either picking up or enroute
        }

        // some of our creeps may have died enroute
        if (this.quantityAssigned == this.quantity) {
            return true;
        }

        return false;
    }


    protected onLoad(): void {
        this.transaction = global.empire.exchange.transactions[this.transactionId];
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    protected onInit(colony: Colony): InitStatus {
        let parts = this.quantity / 50;
        let creeps = Math.ceil((parts * 2 * 50) / (colony.nest.room.energyCapacityAvailable * .8));
        creeps = Math.min(creeps, 5);
        for (var i = 0; i < creeps; i++)
            this.assignments.push(new Assignment(undefined, BodyRepository.hauler()));
        
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() >= 1)
            return StartStatus.Started;
        return StartStatus.TryAgain;
    }

    protected onFinish(colony: Colony): boolean {
        if (this.transaction && !this.transaction.complete)
            this.transaction.cancelRemaining();
        return true;
    }

    protected onCancel(colony: Colony): void {
        this.onFinish(colony);
    }

    public save(): SupplyOperationMemory {
        let mem = super.save() as SupplyOperationMemory;
        mem.transactionId = this.transactionId;
        mem.quantity = this.quantity;
        mem.quantityAssigned = this.quantityAssigned;
        return mem;
    }
}

export interface SupplyOperationMemory extends JobOperationMemory {
    transactionId: string;
    quantity: number;
    quantityAssigned: number;
}
