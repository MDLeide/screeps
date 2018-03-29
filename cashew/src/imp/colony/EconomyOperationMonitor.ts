import { ColonyMonitor } from "lib/colony/ColonyMonitor";
import { Colony } from "lib/colony/Colony";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { ExtensionFillOperation } from "../operation/economic/ExtensionFillOperation";

export class EconomyOperationMonitor extends ColonyMonitor {
    public static fromMemory(memory: MonitorMemory): EconomyOperationMonitor {
        let monitor = new this();
        return ColonyMonitor.fromMemory(memory, monitor) as EconomyOperationMonitor;
    }

    constructor() {
        super(MONITOR_ECONOMY_OPERATION)
    }

    public load(): void {
    }

    public update(context: Colony): void {
        this.checkEconomy(context);
    }

    public execute(context: Colony): void {                
    }

    public cleanup(context: Colony): void {        
    }

    private checkEconomy(colony: Colony): void {
        if (!colony.nest.spawners || !colony.nest.spawners.length)
            return;

        if (colony.resourceManager.structures.sourceAContainer)
            this.ensureOperation(
                colony,
                OPERATION_HARVEST,
                1,
                () => new HarvestOperation(
                    colony.resourceManager.sourceAId,
                    colony.resourceManager.structures.sourceAContainerId,
                    colony.resourceManager.structures.sourceALinkId),
                (op: HarvestOperation) => {
                    return op.sourceId == colony.resourceManager.sourceAId;
                });
        
        if (colony.resourceManager.structures.sourceBContainer)
            this.ensureOperation(
                colony,
                OPERATION_HARVEST,
                1,
                () => new HarvestOperation(
                    colony.resourceManager.sourceBId,
                    colony.resourceManager.structures.sourceBContainerId,
                    colony.resourceManager.structures.sourceBLinkId),
                (op: HarvestOperation) => op.sourceId == colony.resourceManager.sourceBId);
        
        let extCount = colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION }).length;
        if (extCount >= 5)
            this.ensureOperation(
                colony,
                OPERATION_ENERGY_TRANSPORT,
                1,
                () => new EnergyTransportOperation());
        
        if (colony.resourceManager.structures.controllerContainer) {
            this.ensureOperation(
                colony,
                OPERATION_HEAVY_UPGRADE,
                1,
                () => new HeavyUpgradeOperation());
            colony.operations.cancelOperationByType(OPERATION_LIGHT_UPGRADE);
        } else {
            this.ensureOperation(
                colony,
                OPERATION_LIGHT_UPGRADE,
                1,
                () => new LightUpgradeOperation());
        }

        if (colony.resourceManager.structures.extensionLink) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_FILL,
                1,
                () => new ExtensionFillOperation());
        }
    }
}
