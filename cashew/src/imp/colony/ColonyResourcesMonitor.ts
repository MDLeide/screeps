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
    }

    public cleanup(context: Colony): void {
    }
}
