import { MonitorProviderBase } from "lib/monitor/MonitorProvider";
import { MonitorManager } from "../../lib/monitor/MonitorManager";

export class StandardColonyMonitorProvider extends MonitorProviderBase {
    constructor() {
        super(MONITOR_PROVIDER_COLONY_STANDARD)
    }

    public updateMonitors(manager: MonitorManager): void {
        this.ensureMonitor(MONITOR_ECONOMY_OPERATION, manager);
        this.ensureMonitor(MONITOR_INFRASTRUCTURE_OPERATION, manager);
        this.ensureMonitor(MONITOR_REMOTE_MINING_OPERATION, manager);
        this.ensureMonitor(MONITOR_COLONY_RESOURCES, manager);
    }
}
