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
        this.sleep(250);
        if (context.nest.room.storage)
            this.handleStorage(context);
        else
            this.handleNoStorage(context);
    }

    public cleanup(context: Colony): void {
    }

    private handleNoStorage(colony: Colony): void {
        const total = colony.resourceManager.structures.storageContainers.length * 2000;
        if (total == 0)
            return;
        const demandThreshold = total * .6;
        const demandTarget = total * .9;

        this.handleEnergy(colony, demandThreshold, demandTarget);
    }

    private handleStorage(colony: Colony): void {
        const demandThreshold = 50000;
        const demandTarget = 75000;
        const supplyThreshold = 200000;
        const supplyTarget = 100000;

        this.handleEnergy(colony, demandThreshold, demandTarget, supplyThreshold, supplyTarget);
    }

    private handleEnergy(colony: Colony, demandThreshold?: number, demandTarget?: number, supplyThreshold?: number, supplyTarget?: number): void {
        let resources = colony.resourceManager.getResourceCount();
        if (!resources[RESOURCE_ENERGY])
            return;

        let balance = global.empire.exchange.getColonyBalance(colony);
        if (balance[RESOURCE_ENERGY])
            resources[RESOURCE_ENERGY] += balance[RESOURCE_ENERGY];
        
        if (demandThreshold && demandTarget && resources[RESOURCE_ENERGY] < demandThreshold) {
            if (demandTarget < demandThreshold) throw Error("Demand target must be great than threshold.");

            let supply = global.empire.exchange.getColonySupplyOrder(colony, RESOURCE_ENERGY);
            if (supply)
                global.empire.exchange.cancelSupplyOrder(supply.id);
            let demand = global.empire.exchange.getColonyDemandOrder(colony, RESOURCE_ENERGY);
            if (!demand)
                global.empire.exchange.createDemandOrder(colony, RESOURCE_ENERGY, demandTarget - resources[RESOURCE_ENERGY]);

        } else if (supplyThreshold && supplyTarget && resources[RESOURCE_ENERGY] > supplyThreshold) {
            if (supplyTarget > supplyThreshold) throw Error("Supply target must be less than supply threshold.");

            let demand = global.empire.exchange.getColonyDemandOrder(colony, RESOURCE_ENERGY);
            if (demand)
                global.empire.exchange.cancelDemandOrder(demand.id);
            let supply = global.empire.exchange.getColonySupplyOrder(colony, RESOURCE_ENERGY);
            if (!supply)
                global.empire.exchange.createSupplyOrder(colony, RESOURCE_ENERGY, resources[RESOURCE_ENERGY] - supplyTarget);
        }
    }
}
