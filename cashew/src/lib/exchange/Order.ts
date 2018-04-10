import { LinkGenerator } from "../util/LinkGenerator";

/*
 * Colony creates order
 * Monitor creates transaction, reserving against orders
 * Operation fills transaction, filling order
 *
 * Colony cancels order
 * Related transactions are canceled
 *
 * Colony adjusts order
 * Related transactions are adjusted
 *
 * 
 */

export class Exchange {

}

export class ExchangeBackend {
    public transactions: { [id: string]: Transaction } = {};
    public supplyOrders: { [id: string]: Order } = {};
    public demandOrders: { [id: string]: Order } = {};

    public cancelOrder(order: Order): void {
        let transactions = this.findTransactionsForOrder(order);
        for (var i = 0; i < transactions.length; i++) {
            transactions[i].cancel();
        }
    }

    public adjustOrderQuantity(order: Order, reserveAdjustment: number): void {
        let transactions = this.findTransactionsForOrder(order);
        for (var i = 0; i < transactions.length; i++) {
            let t = transactions[i];
            let adjAmount = t.notPickedUp;
            
        }
    }

    public cancelTransaction(transaction: Transaction): void {
        if (!transaction.supplyOrder.canceled)
            transaction.supplyOrder.cancelReservation(transaction.notPickedUp);
        if (!transaction.demandOrder.canceled)
            transaction.demandOrder.cancelReservation(transaction.notDelivered);
    }

    public findTransactionsForOrder(order: Order): Transaction[] {
        let transactions = [];
        for (let id in this.transactions)
            if (order.type == OrderType.Supply && this.transactions[id].supplyOrder.id == order.id || order.type == OrderType.Demand && this.transactions[id].demandOrder.id == order.id)
                transactions.push(this.transactions[id]);
        return transactions;
    }
}

export class Transaction {
    private mySupplyOrder: Order;
    private myDemandOrder: Order;
    private myQuantity: number;
    private myPickedUp: number;
    private myDelivered: number;
    private myCanceled: boolean;
    private exchange: ExchangeBackend;

    public get supplyOrder(): Order { return this.mySupplyOrder; }
    public get demandOrder(): Order { return this.myDemandOrder; }
    public get quantity(): number { return this.myQuantity; }
    public get pickedUp(): number { return this.myPickedUp; }
    public get delivered(): number { return this.myDelivered; }
    public get notPickedUp(): number { return this.quantity - this.pickedUp; }
    public get notDelivered(): number { return this.quantity - this.delivered; }
    public get canceled(): boolean { return this.myCanceled; }
    public get complete(): boolean { return this.delivered >= this.quantity; }
    public get completeOrCanceled(): boolean { return this.canceled || this.complete; }

    public cancel(): void {
        this.myCanceled = true;
        this.exchange.cancelTransaction(this);
    }

    public pickup(quantity: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled transaction.");
        if (quantity >= this.notPickedUp) throw new Error("Quantity exceeds remaining quantity to be picked up.");
        this.myPickedUp += quantity;
        this.supplyOrder.fill(quantity);
    }

    public deliver(quantity: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled transaction.");
        if (quantity >= this.notDelivered) throw new Error("Quantity exceeds remaining quantity to be delivered.");
        this.myDelivered += quantity;
        this.demandOrder.fill(quantity);
    }

    /** Internal. */
    public adjustQuantity(adjustment: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled transaction.");
        this.myQuantity += adjustment;
    }
}

export class Order {
    private myId: string;
    private myColony: string;
    private myTickCreated: number;
    private myType: OrderType;
    private myResource: ResourceConstant;
    private myTotalQuantity: number;
    private myReservedQuantity: number;
    private myFilledQuantity: number;
    private myCanceled: boolean;
    private exchange: ExchangeBackend;

    constructor(id: string, colony: string, type: OrderType, resource: ResourceConstant, quantity: number, exchange: ExchangeBackend) {
        this.myId = id;
        this.myColony = colony;
        this.myType = type;
        this.myResource = resource;
        this.myTotalQuantity = quantity;
        this.myReservedQuantity = 0;
        this.myFilledQuantity = 0;
        this.exchange = exchange;
    }
    
    public get id(): string { return this.myId; }
    public get tickCreated(): number { return this.myTickCreated; }
    public get type(): OrderType { return this.myType; }
    public get colony(): string { return this.myColony; }
    public get resource(): ResourceConstant { return this.myResource; }
    public get totalQuantity(): number { return this.myTotalQuantity; }
    public get reservedQuantity(): number { return this.myReservedQuantity; }    
    public get filledQuantity(): number { return this.myFilledQuantity; }
    public get canceled(): boolean { return this.myCanceled; }

    public get unreservedQuantity(): number { return this.totalQuantity - this.reservedQuantity; }
    public get unfilledQuantity(): number { return this.totalQuantity - this.filledQuantity; }
    public get reservedButUnfilledQuantity(): number { return this.reservedQuantity - this.filledQuantity; }
    public get complete(): boolean { return this.filledQuantity >= this.totalQuantity; }
    public get completeOrCanceled(): boolean { return this.canceled || this.complete; }


    public cancel(): void {
        this.myCanceled = true;
        this.exchange.cancelOrder(this);
    }

    public adjustQuantity(adjustBy: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or cancled order.");
        if (adjustBy < 0)
            if (this.totalQuantity + adjustBy < this.filledQuantity) throw new Error("Cannot reduce quantity below already filled amount.");

        this.myTotalQuantity += adjustBy;
        let reserveAdjustment = this.reservedQuantity - this.totalQuantity;
        if (reserveAdjustment > 0) {
            this.myReservedQuantity = this.myTotalQuantity;
            this.exchange.adjustOrderQuantity(this, reserveAdjustment);
        }
    }

    /** Internal. */
    public reserve(quantity: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled order.");
        if (quantity < 1) throw new Error("Cannot reserve zero or negative quantity.");
        if (quantity > this.unreservedQuantity) throw new Error("Cannot reserve more than total quantity.");
        
        this.myReservedQuantity += quantity;
    }

    /** Internal. */
    public cancelReservation(quantity: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled order.");
        if (quantity < 1) throw new Error("Cannot cancel zero or negative reservation quantity.");
        if (quantity > this.reservedQuantity - this.filledQuantity) throw new Error("Cannot cancel reservation for amount more than reserved or already filled.");

        this.myReservedQuantity -= quantity;
    }

    /** Internal. */
    public fill(quantity: number): void {
        if (this.completeOrCanceled) throw new Error("Cannot modify a complete or canceled order.");
        if (quantity < 1) throw new Error("Cannot fill zero or negative quantity.");
        if (quantity > this.unfilledQuantity) throw new Error("Cannot fill more than unfilled quantity.");
        if (quantity > this.reservedQuantity - this.unfilledQuantity) throw new Error("Must reserve quantity before filling.");
        
        this.myFilledQuantity += quantity;
    }

    public toString(): string {
        let type = this.type == OrderType.Supply ? "Supply" : "Demand";
        let col = global.empire.getColonyByName(this.colony);
        return `${type} Order for ${this.resource} | ${LinkGenerator.linkRoom(col.nest.room, col.name)} | ${this.totalQuantity}t/${this.reservedQuantity}r/${this.filledQuantity}f`;
    }
}

export enum OrderType {
    Supply,
    Demand
}
