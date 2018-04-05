import { EmpireMonitor } from "lib/empire/EmpireMonitor";
import { Empire } from "lib/empire/Empire";
import { Exchange, Order } from "lib/empire/Exchange";
import { RoomHelper } from "lib/util/RoomHelper";
import { SupplyOperation } from "../operation/economic/SupplyOperation";

export class ExchangeMonitor extends EmpireMonitor {
    public static fromMemory(memory: EmpireMonitorMemory): ExchangeMonitor {
        let monitor = new this();
        return EmpireMonitor.fromMemory(memory, monitor) as ExchangeMonitor;
    }

    constructor() {
        super(MONITOR_EXCHANGE);
    }

    public load(): void {
    }

    public update(context: Empire): void {
        this.sleep(50);
        context.exchange.clearCompleted();
        for (let key in context.exchange.supplyOrders) {            
            let sOrder = context.exchange.supplyOrders[key];
            while (sOrder.unreservedQuantity > 0) {
                let dOrder = this.findBestMatch(sOrder, context.exchange);
                if (!dOrder) break;
                let sColony = context.getColonyByName(sOrder.colony);
                if (!sColony) break;
                let transaction = context.exchange.createTransaction(sOrder.id, dOrder.id);
                let op = new SupplyOperation(transaction);
                sColony.operations.addOperation(op);
            }
        }
    }

    public execute(context: Empire): void {
    }

    public cleanup(context: Empire): void {
    }

    

    private findBestMatch(supplyOrder: Order, exchange: Exchange): Order {
        let distance = 100000;
        let order: Order;
        for (let key in exchange.demandOrders) {
            let demandOrder = exchange.demandOrders[key];
            if (demandOrder.resource != supplyOrder.resource) continue;
            if (demandOrder.unreservedQuantity == 0) continue;
            let sColony = global.empire.getColonyByName(supplyOrder.colony);
            let dColony = global.empire.getColonyByName(demandOrder.colony);
            let d = RoomHelper.getDistanceBetweenRooms(sColony.nest.roomName, dColony.nest.roomName, true);
            if (d < distance) {
                distance = d;
                order = demandOrder;
            }
        }
        return order;
    }
}
