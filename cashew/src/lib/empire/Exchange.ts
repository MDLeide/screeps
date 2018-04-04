import { Colony } from "../colony/Colony";

export class Exchange {
    public static fromMemory(memory: ExchangeMemory): Exchange {
        let ex = new this();
        for (let key in memory.demandOrders)
            ex.demandOrders[key] = Order.fromMemory(memory.demandOrders[key]);
        for (let key in memory.supplyOrders)
            ex.supplyOrders[key] = Order.fromMemory(memory.supplyOrders[key]);
        return ex;
    }

    public supplyOrders: { [orderId: string]: Order } = {};
    public demandOrders: { [orderId: string]: Order } = {};
    
    /**
     * Creates a supply order and registers it with the exchange.
     * @param colony Colony supplying the resources.
     * @param resource The resource being supplied.
     * @param quantity The quantity of resource being supplied.
     */
    public createSupplyOrder(colony: Colony, resource: ResourceConstant, quantity: number): Order {
        if (this.getColonySupplyOrder(colony, resource)) throw new Error("Supply order already exists for this colony and resource.");
        let id = this.generateId(OrderType.Supply, colony, resource);
        let order = new Order(id, OrderType.Supply, colony.name, resource, quantity, Game.time);
        this.supplyOrders[id] = order;
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
        let id = this.generateId(OrderType.Demand, colony, resource);
        let order = new Order(id, OrderType.Demand, colony.name, resource, quantity, Game.time);
        this.demandOrders[id] = order;
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
            if (this.supplyOrders[key].colony == colony.name && this.supplyOrders[key].resource == resource)
                return this.supplyOrders[key];
        return null;
    }

    public getColonyDemandOrder(colony: Colony, resource: ResourceConstant): Order {
        for (let key in this.demandOrders)
            if (this.demandOrders[key].colony == colony.name && this.demandOrders[key].resource == resource)
                return this.demandOrders[key];
        return null;
    }

    /**
     * Reserves quantity on a supply and demand order.
     * @param supplyId Order id of the supplying order.
     * @param demandId Order id of the demanding order.
     * @param quantity Optional quantity to reserve. If omited, the maximum possible quantity will be reserved.
     */
    public reserveOrder(supplyId: string, demandId: string, quantity?: number): void {
        let supply = this.supplyOrders[supplyId];
        if (!supply) throw Error("Supply order does not exist.");
        if (supply.unreservedQuantity <= 0) throw Error("Supply order already fully reserved.");

        let demand = this.demandOrders[demandId];
        if (!demand) throw Error("Demand order does not exist.");
        if (demand.unreservedQuantity <= 0) throw Error("Demand order already fully reserved.");

        if (quantity) {
            if (quantity > supply.unreservedQuantity) throw Error("Quantity in excess of supply's unreserved quantity.");
            if (quantity > demand.unreservedQuantity) throw Error("Quantity in excess of demand's unreserved quantity.");
        } else {
            quantity = Math.min(supply.unreservedQuantity, demand.unreservedQuantity);
        }
        
        supply.reserve(demandId, quantity);
        demand.reserve(supplyId, quantity);
    }

    public cancelReservation(supplyId: string, demandId: string): void {
        let supply = this.supplyOrders[supplyId];
        if (!supply) throw Error("Supply order does not exist.");
        let demand = this.demandOrders[demandId];
        if (!demand) throw Error("Demand order does not exist.");
        if (!supply.reservedBy[demandId] || !demand.reservedBy[supplyId]) throw Error("Reservation does not exist.");
        if (supply.filledBy[demandId] || demand.filledBy[supplyId]) throw Error("Reservation already filled.");
        supply.cancelReservation(demandId);
        demand.cancelReservation(supplyId);
    }

    /**
     * Fills quantity on a supply and demand order.
     * @param supplyId Order id of the supplying order.
     * @param demandId Order id of the demanding order.
     * @param quantity Optional quantity to fill. If omited, the maximum possible quantity will be filled.
     */
    public fillOrder(supplyId: string, demandId: string, quantity?: number): void {
        let supply = this.supplyOrders[supplyId];
        if (!supply) throw Error("Supply order does not exist.");
        if (supply.unfilledQuantity <= 0) throw Error("Supply order already fully filled.");

        let demand = this.demandOrders[demandId];
        if (!demand) throw Error("Demand order does not exist.");
        if (demand.unfilledQuantity <= 0) throw Error("Demand order already fully filled.");

        if (quantity) {
            if (quantity > supply.unfilledQuantity) throw Error("Quantity in excess of supply's unfilled quantity.");
            if (quantity > demand.unfilledQuantity) throw Error("Quantity in excess of demand's unfilled quantity.");
        } else {
            quantity = Math.min(supply.unfilledQuantity, demand.unfilledQuantity);
        }

        supply.fill(demandId, quantity);
        demand.fill(supplyId, quantity);
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
            mem[key] = orders[key].save();
        return mem;
    }

    public save(): ExchangeMemory {
        return {
            supplyOrders: this.getOrderMemory(this.supplyOrders),
            demandOrders: this.getOrderMemory(this.demandOrders)
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
        order.reservedBy = memory.reservedBy;
        order.filledBy = memory.filledBy;
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

    public reservedQuantity: number;
    public unreservedQuantity: number;
    public filledQuantity: number;
    public unfilledQuantity: number;

    public reservedBy: { [orderId: string]: number };
    public filledBy: { [orderId: string]: number };

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
        if (this.filledBy[id]) throw Error("Order already registered to fill.");
        this.filledQuantity += quantity;
        this.unfilledQuantity -= quantity;
        this.filledBy[id] = quantity;
    }

    public adjustQuantity(newQuantity: number): void {
        if (newQuantity < this.reservedQuantity) throw Error("Invalid quantity change. Cannot reduce total quantity below reserved quantity.");
        this.quantity = newQuantity;
        this.unreservedQuantity = this.quantity - this.reservedQuantity;
        this.unfilledQuantity = this.quantity - this.filledQuantity;
    }

    public cancelReservation(id: string): void {
        if (!this.reservedBy[id]) throw Error("Order does not have a reservation.");
        this.reservedQuantity -= this.reservedBy[id];
        this.unreservedQuantity += this.reservedBy[id];
        this.reservedBy[id] = undefined;
    }

    public cancelFulfillment(id: string): void {
        if (!this.filledBy[id]) throw Error("Order does not have a fulfillment.")
        this.filledQuantity -= this.filledBy[id];
        this.unfilledQuantity += this.filledBy[id];
        this.filledBy[id] = undefined;
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
