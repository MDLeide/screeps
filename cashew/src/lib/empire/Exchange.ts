import { Colony } from "../colony/Colony";
import { LinkGenerator } from "../util/LinkGenerator";

export class Exchange {
    public static fromMemory(memory: ExchangeMemory): Exchange {
        let ex = new this();
        for (let key in memory.demandOrders)
            ex.demandOrders[key] = Order.fromMemory(memory.demandOrders[key]);
        for (let key in memory.supplyOrders)
            ex.supplyOrders[key] = Order.fromMemory(memory.supplyOrders[key]);
        for (let key in memory.transactions)
            ex.transactions[key] = Transaction.fromMemory(memory.transactions[key], ex);
        return ex;
    }

    public supplyOrders: { [orderId: string]: Order } = {};
    public demandOrders: { [orderId: string]: Order } = {};
    public transactions: { [transactionId: string]: Transaction } = {};

    /**
     * Creates a supply order and registers it with the exchange.
     * @param colony Colony supplying the resources.
     * @param resource The resource being supplied.
     * @param quantity The quantity of resource being supplied.
     */
    public createSupplyOrder(colony: Colony, resource: ResourceConstant, quantity: number): Order {
        if (this.getColonySupplyOrder(colony, resource)) throw new Error("Supply order already exists for this colony and resource.");
        if (this.getColonyDemandOrder(colony, resource)) throw new Error("Cannot create supply order when outstanding demand order for same colony and resource exists.");
        let id = this.generateId(OrderType.Supply, colony, resource);
        let order = new Order(id, OrderType.Supply, colony.name, resource, quantity, Game.time);
        this.supplyOrders[id] = order;
        global.events.exchange.orderCreated(order);
        return order;
    }

    /**
     * Creates a demand order and registers it with the exchange.
     * @param colony Colony supplying the resources.
     * @param resource The resource being supplied.
     * @param quantity The quantity of resource being supplied.
     */
    public createDemandOrder(colony: Colony, resource: ResourceConstant, quantity: number): Order {
        if (this.getColonyDemandOrder(colony, resource)) throw new Error("Demand order already exists for this colony and resource.");
        if (this.getColonySupplyOrder(colony, resource)) throw new Error("Cannot create demand order when outstanding supply order for same colony and resource exists.");
        let id = this.generateId(OrderType.Demand, colony, resource);
        let order = new Order(id, OrderType.Demand, colony.name, resource, quantity, Game.time);
        this.demandOrders[id] = order;
        global.events.exchange.orderCreated(order);
        return order;
    }

    public adjustSupplyOrder(id: string, newQuantity: number): void {
        let supply = this.supplyOrders[id];
        if (!supply) throw Error("Supply order does not exist.");
        if (newQuantity < supply.reservedQuantity) throw Error("Invalid quantity change. Cannot reduce total quantity below reserved quantity.");
        supply.adjustQuantity(newQuantity);
    }

    public adjustDemandOrder(id: string, newQuantity: number): void {
        let demand = this.demandOrders[id];
        if (!demand) throw Error("Demand order does not exist.");
        if (newQuantity < demand.reservedQuantity) throw Error("Invalid quantity change. Cannot reduce total quantity below reserved quantity.");
        demand.adjustQuantity(newQuantity);
    }

    public cancelSupplyOrder(id: string): void {
        let order = this.supplyOrders[id];
        if (!order) throw Error("Supply order does not exist.");
        if (order.canceled) throw Error("Order already canceled.");
        for (let key in order.reservedBy) {
            if (!order.filledBy[key]) {
                order.cancelReservation(key);
                this.demandOrders[key].cancelReservation(id);
            }
        }
        order.canceled = true;
    }

    public cancelDemandOrder(id: string): void {
        let order = this.demandOrders[id];
        if (!order) throw Error("Demand order does not exist.");
        if (order.canceled) throw Error("Order already canceled.");
        for (let key in order.reservedBy) {
            if (!order.filledBy[key]) {
                order.cancelReservation(key);
                this.supplyOrders[key].cancelReservation(id);
            }
        }
        order.canceled = true;
    }

    public getColonySupplyOrder(colony: Colony, resource: ResourceConstant): Order {
        for (let key in this.supplyOrders)
            if (this.supplyOrders[key].colony == colony.name && this.supplyOrders[key].resource == resource && !this.supplyOrders[key].canceled)
                return this.supplyOrders[key];
        return null;
    }

    public getColonyDemandOrder(colony: Colony, resource: ResourceConstant): Order {
        for (let key in this.demandOrders)
            if (this.demandOrders[key].colony == colony.name && this.demandOrders[key].resource == resource && !this.demandOrders[key].canceled)
                return this.demandOrders[key];
        return null;
    }

    /** Gets a tally of all unfilled orders. Demand is positive, supply is negative. */
    public getColonyBalance(colony: Colony): { [resource: string]: number } {
        let balance = {};
        for (let key in this.supplyOrders)
            if (this.supplyOrders[key].colony == colony.name && !this.supplyOrders[key].canceled)
                balance[this.supplyOrders[key].resource] = -this.supplyOrders[key].unfilledQuantity;
        for (let key in this.demandOrders)
            if (this.demandOrders[key].colony == colony.name && !this.demandOrders[key].canceled)
                balance[this.demandOrders[key].resource] = this.demandOrders[key].unfilledQuantity;
        return balance;
    }

    /**
     * Creates a transaction, which reserves the quantity on each order, and provides a convenient
     * way to work with the relationship between two orders.
     * @param supplyId
     * @param demandOrder
     * @param quantity
     */
    public createTransaction(supplyOrder: Order | string, demandOrder: Order | string, quantity?: number): Transaction {
        if (typeof (supplyOrder) == "string")
            return this.createTransaction(this.supplyOrders[supplyOrder], demandOrder, quantity);
        if (typeof (demandOrder) == "string")
            return this.createTransaction(supplyOrder, this.demandOrders[demandOrder], quantity);

        if (supplyOrder.type != OrderType.Supply) throw Error("Order passed as supply order is not of the correct type (demand instead of supply).");
        if (demandOrder.type != OrderType.Demand) throw Error("Order passed as demand order is not of the correct type (supply instead of demand).");

        if (!quantity) quantity = Math.min(supplyOrder.unreservedQuantity, demandOrder.unreservedQuantity);

        let transaction = new Transaction(supplyOrder, demandOrder, quantity);
        this.transactions[transaction.id] = transaction;
        global.events.exchange.transactionCreated(transaction);
        return transaction;
    }

    public clearCompleted(): void {
        for (let key in this.supplyOrders)
            if (this.supplyOrders[key].unfilledQuantity == 0 || this.supplyOrders[key].canceled)
                this.supplyOrders[key] = undefined;
        for (let key in this.demandOrders)
            if (this.demandOrders[key].unfilledQuantity == 0 || this.demandOrders[key].canceled)
                this.demandOrders[key] = undefined;
        for (let key in this.transactions)
            if (this.transactions[key].complete)
                this.transactions[key] = undefined;
    }
    
    protected generateId(type: OrderType, colony: Colony, resource: ResourceConstant): string {
        let count = 0;
        let id = `${(type == OrderType.Supply) ? "S" : "D"}-${resource}-${colony.name}-${count}`;
        if (type == OrderType.Demand) {
            while (this.demandOrders[id]) {
                count++;
                id = `D-${resource}-${colony.name}-${count}`;
            }
        } else {
            while (this.supplyOrders[id]) {
                count++;
                id = `S-${resource}-${colony.name}-${count}`;
            }
        }
        return id;
    }
    
    private getOrderMemory(orders: { [orderId: string]: Order }): { [orderId: string]: OrderMemory } {
        let mem = {};
        for (let key in orders)
            if (orders[key])
                mem[key] = orders[key].save();
        return mem;
    }

    private getTransactionMemory(): { [transactionId: string]: TransactionMemory } {
        let mem = {};
        for (let key in this.transactions)
            mem[key] = this.transactions[key].save();
        return mem;
    }

    public save(): ExchangeMemory {
        return {
            supplyOrders: this.getOrderMemory(this.supplyOrders),
            demandOrders: this.getOrderMemory(this.demandOrders),
            transactions: this.getTransactionMemory()
        };
    }
}

export class Transaction {
    public static fromMemory(memory: TransactionMemory, exchange: Exchange): Transaction {
        let t = Object.create(Transaction.prototype) as Transaction;
        t.supplyOrder = exchange.supplyOrders[memory.supplyOrderId];
        t.demandOrder = exchange.demandOrders[memory.demandOrderId];
        t.quantity = memory.quantity;
        t.complete = memory.complete;
        return t;
    }

    constructor(supplyOrder: Order, demandOrder: Order, quantity: number) {
        if (supplyOrder.unreservedQuantity < quantity) throw Error("Not enough remaining quantity.");
        if (demandOrder.unreservedQuantity < quantity) throw Error("Not enough remaining quantity.");
        if (supplyOrder.resource != demandOrder.resource) throw Error("Order resource types do not match.");

        this.supplyOrder = supplyOrder;
        this.demandOrder = demandOrder;
        this.quantity = quantity;
        this.supplyOrder.reserve(this.demandOrder.id, quantity);
        this.demandOrder.reserve(this.supplyOrder.id, quantity);
    }

    public supplyOrder: Order;
    public demandOrder: Order;
    public quantity: number;
    public complete: boolean;
    public get pickedUp(): number { return this.supplyOrder.filledBy[this.demandOrder.id]; }
    public get delivered(): number { return this.demandOrder.filledBy[this.supplyOrder.id]; }
    public get inTransit(): number { return this.pickedUp - this.delivered; }
    public get resource(): ResourceConstant { return this.supplyOrder.resource; }    
    public get id(): string { return this.supplyOrder.id + "--" + this.demandOrder.id; }

    public pickUp(quantity: number): void {
        this.supplyOrder.fill(this.demandOrder.id, quantity);
        global.events.exchange.transactionPickup(this, quantity);
    }

    public deliver(quantity: number): void {
        this.demandOrder.fill(this.supplyOrder.id, quantity);
        global.events.exchange.transactionDeliver(this, quantity);
        if (this.delivered == this.quantity) {
            this.complete = true;
            global.events.exchange.transactionComplete(this);
        }
    }

    public cancelRemaining(): void {
        this.demandOrder.cancelReservation(this.supplyOrder.id);
        this.supplyOrder.cancelReservation(this.demandOrder.id);
        this.complete = true;
    }

    public toString(): string {
        let sColony = global.empire.getColonyByName(this.supplyOrder.colony);
        let dColony = global.empire.getColonyByName(this.demandOrder.colony);
        return `Transaction | ${this.quantity} of ${this.resource} | ${LinkGenerator.linkRoom(sColony.nest.room, sColony.name)} => ${LinkGenerator.linkRoom(dColony.nest.room, dColony.name)} | ${this.pickedUp}p/${this.delivered}d `;
    }

    public save(): TransactionMemory {
        return {
            supplyOrderId: this.supplyOrder ? this.supplyOrder.id : undefined,
            demandOrderId: this.demandOrder ? this.demandOrder.id : undefined,
            quantity: this.quantity,
            complete: this.complete
        };
    }
}

export class Order {
    public static fromMemory(memory: OrderMemory): Order {
        let order = new this(memory.id, memory.type, memory.colony, memory.resource, memory.quantity, memory.tickCreated);
        order.canceled = memory.canceled;
        order.reservedQuantity = memory.reservedQuantity;
        order.unreservedQuantity = memory.unreservedQuantity;
        order.filledQuantity = memory.filledQuantity;
        order.unfilledQuantity = memory.unfilledQuantity;
        order.reservedBy = memory.reservedBy ? memory.reservedBy : {};
        order.filledBy = memory.filledBy ? memory.filledBy : {};
        return order;
    }

    constructor(id: string, type: OrderType, colony: string, resource: ResourceConstant, quantity: number, tickCreated: number) {
        this.id = id;
        this.type = type;
        this.colony = colony;
        this.resource = resource;
        this.quantity = quantity;
        this.tickCreated = tickCreated;
        this.reservedQuantity = 0;
        this.unreservedQuantity = quantity;
        this.filledQuantity = 0;
        this.unfilledQuantity = quantity;
    }

    public id: string;
    public type: OrderType;    
    public colony: string;
    public resource: ResourceConstant;    
    public quantity: number;
    public tickCreated: number;
    public canceled: boolean;

    public reservedQuantity: number = 0;
    public unreservedQuantity: number = 0;
    public filledQuantity: number = 0;
    public unfilledQuantity: number = 0;

    public reservedBy: { [orderId: string]: number } = {};
    public filledBy: { [orderId: string]: number } = {};

    /**
     * Reserves a portion of this order for fulfillment.
     * @param otherOrderId The id of the order that will fulfill the request.
     * @param quantity The quantity being fulfilled.
     */
    public reserve(otherOrderId: string, quantity: number): void {
        if (quantity > this.unreservedQuantity) throw Error("Cannot reserve more than total quantity.");
        if (this.reservedBy[otherOrderId]) throw Error("Reservation already exists for this order.");
        this.reservedQuantity += quantity;
        this.unreservedQuantity -= quantity;
        this.reservedBy[otherOrderId] = quantity;
    }

    public fill(id: string, quantity: number): void {
        if (quantity > this.unfilledQuantity) throw Error("Cannot fill more than total quantity.");
        if (!this.reservedBy[id]) {
            throw Error("Must reserve quantity before filling.");
        } else {
            let filled = this.filledBy[id];
            if (!filled) filled = 0;
            if (quantity > this.reservedBy[id] - filled) throw Error("Insufficient reserved quantity remaining.");
        }
             
        
        this.filledQuantity += quantity;
        this.unfilledQuantity -= quantity;
        if (this.filledBy[id])
            this.filledBy[id] += quantity;
        else
            this.filledBy[id] = quantity;

        if (this.unfilledQuantity == 0)
            global.events.exchange.orderComplete(this);
    }

    public adjustQuantity(newQuantity: number): void {        
        this.quantity = Math.max(newQuantity, this.reservedQuantity);
        this.unreservedQuantity = this.quantity - this.reservedQuantity;
        this.unfilledQuantity = this.quantity - this.filledQuantity;
    }

    /**
     * Cancels any remaining reservation on this order, does not cancel quantity already filled.
     * @param id
     */
    public cancelReservation(id: string): void {
        if (!this.reservedBy[id]) throw Error("Order does not have a reservation.");
        let filled = this.filledBy[id];
        if (!filled) filled = 0;
        this.reservedQuantity -= (this.reservedBy[id] - filled);
        this.unreservedQuantity += (this.reservedBy[id] - filled);
        this.reservedBy[id] = filled;
    }

    public cancelFulfillment(id: string): void {
        if (!this.filledBy[id]) throw Error("Order does not have a fulfillment.")
        this.filledQuantity -= this.filledBy[id];
        this.unfilledQuantity += this.filledBy[id];
        this.filledBy[id] = undefined;
    }

    public toString(): string {
        let type = this.type == OrderType.Supply ? "Supply" : "Demand";
        let col = global.empire.getColonyByName(this.colony);
        return `${type} Order for ${this.resource} | ${LinkGenerator.linkRoom(col.nest.room, col.name)} | ${this.quantity}t/${this.reservedQuantity}r/${this.filledQuantity}f`;
    }

    public save(): OrderMemory {
        return {
            id: this.id,
            type: this.type,
            colony: this.colony,
            resource: this.resource,
            quantity: this.quantity,
            tickCreated: this.tickCreated,
            canceled: this.canceled,
            reservedQuantity: this.reservedQuantity,
            unreservedQuantity: this.unreservedQuantity,
            filledQuantity: this.filledQuantity,
            unfilledQuantity: this.unfilledQuantity,
            reservedBy: this.reservedBy,
            filledBy: this.filledBy
        };
    }
}

export enum OrderType {
    Supply,
    Demand
}
