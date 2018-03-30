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
        let rcl = colony.getEffectiveRcl();

        if (rcl.isLessThanOrEqualTo(1, 0))
            return;

        if (rcl.isGreaterThanOrEqualTo(1, 2))
            this.ensureOperation(
                colony,
                OPERATION_HARVEST,
                1,
                () => new HarvestOperation(
                    colony.resourceManager.sourceAId,
                    colony.resourceManager.structures.sourceAContainerId,
                    colony.resourceManager.structures.sourceALinkId),
                (op: HarvestOperation) => op.sourceId == colony.resourceManager.sourceAId);
            

        if (rcl.isLessThanOrEqualTo(1, 3) && colony.resourceManager.sourceBId)
            this.ensureOperation(
                colony,
                OPERATION_HARVEST,
                1,
                () => new HarvestOperation(
                    colony.resourceManager.sourceBId,
                    colony.resourceManager.structures.sourceBContainerId,
                    colony.resourceManager.structures.sourceBLinkId),
                (op: HarvestOperation) => op.sourceId == colony.resourceManager.sourceBId);
        
        
        if (rcl.isGreaterThanOrEqualTo(2, 1))
            this.ensureOperation(
                colony,
                OPERATION_ENERGY_TRANSPORT,
                1,
                () => new EnergyTransportOperation());
        
        if (rcl.isGreaterThanOrEqualTo(2, 2)) {
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

        if (rcl.isGreaterThanOrEqualTo(6, 2)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_FILL,
                1,
                () => new ExtensionFillOperation());
        }
    }
}
