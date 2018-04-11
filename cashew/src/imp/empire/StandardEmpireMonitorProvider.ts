import { MonitorProviderBase } from "lib/monitor/MonitorProvider";
import { MonitorManager } from "lib/monitor/MonitorManager";

export class StandardEmpireMonitorProvider extends MonitorProviderBase {
    constructor() {
        super(MONITOR_PROVIDER_EMPIRE_STANDARD);
    }

    public updateMonitors(manager: MonitorManager): void {
        this.ensureMonitor(MONITOR_EXCHANGE, manager);
        this.ensureMonitor(MONITOR_REMOTE_MINING, manager);
    }
}
