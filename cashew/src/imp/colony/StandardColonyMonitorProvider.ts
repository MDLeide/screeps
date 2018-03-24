import { MonitorProviderBase } from "lib/monitor/MonitorProvider";
import { MonitorManager } from "../../lib/monitor/MonitorManager";

export class StandardColonyMonitorProvider extends MonitorProviderBase {
    constructor() {
        super(MONITOR_PROVIDER_STANDARD)
    }

    public updateMonitors(manager: MonitorManager): void {
        this.ensureMonitor(MONITOR_ECONOMY_OPERATION, 1, manager);
        this.ensureMonitor(MONITOR_INFRASTRUCTURE_OPERATION, 1, manager);
        this.ensureMonitor(MONITOR_REMOTE_MINING_OPERATION, 1, manager);
        this.ensureMonitor(MONITOR_COLONY_DEFENSE, 1, manager);
    }
}
