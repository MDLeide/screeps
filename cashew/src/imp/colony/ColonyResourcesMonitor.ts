import { ColonyMonitor } from "lib/colony/ColonyMonitor";
import { Colony } from "lib/colony/Colony";

export class ColonyResourcesMonitor extends ColonyMonitor {
    public static fromMemory(memory: ColonyMonitorMemory): ColonyResourcesMonitor {
        let monitor = new this();
        return ColonyMonitor.fromMemory(memory, monitor) as ColonyResourcesMonitor;
    }

    constructor() {
        super(MONITOR_COLONY_RESOURCES);
    }


    public load(): void {
    }

    public update(context: Colony): void {
    }

    public execute(context: Colony): void {
        this.sleep(50);
        //this.handle(context, RESOURCE_ENERGY);
    }

    public cleanup(context: Colony): void {
    }

    private handle(colony: Colony, resource: ResourceConstant): void {
        let surplus = colony.resourceManager.getSurplus(resource);
        if (surplus) {
            let demandOrder = global.empire.exchange.getColonyDemandOrder(colony, resource);
            if (demandOrder)
                global.empire.exchange.cancelDemandOrder(demandOrder.id);

            let supplyOrder = global.empire.exchange.getColonySupplyOrder(colony, resource);
            if (supplyOrder)
                supplyOrder.adjustQuantity(surplus);
            else 
                global.empire.exchange.createSupplyOrder(colony, resource, surplus);

            return;
        }

        let demand = colony.resourceManager.getDemand(resource);
        if (demand) {            
            let supplyOrder = global.empire.exchange.getColonySupplyOrder(colony, resource);
            if (supplyOrder)
                supplyOrder.adjustQuantity(0);            

            let demandOrder = global.empire.exchange.getColonyDemandOrder(colony, resource);
            if (demandOrder)
                demandOrder.adjustQuantity(demand);
            else
                global.empire.exchange.createDemandOrder(colony, resource, demand);
        }
    }
}
