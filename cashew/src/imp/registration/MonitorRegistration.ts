import { ColonyDefenseMonitor, ColonyDefenseMonitorMemory } from "../colony/militaryMonitors/ColonyDefenseMonitor";
import { MonitorRepository } from "lib/monitor/Monitor";
import { EconomyOperationMonitor } from "../colony/EconomyOperationMonitor";
import { InfrastructureOperationMonitor } from "../colony/InfrastructureOperationMonitor";
import { RemoteMiningOperationMonitor } from "../colony/RemoteMiningOperationMonitor";
import { MonitorProviderRepository } from "lib/monitor/MonitorProvider";
import { StandardColonyMonitorProvider } from "../colony/StandardColonyMonitorProvider";

//import { ColonyMonitorRepository } from "../../lib/colony/ColonyMonitor";

export class MonitorRegistration {
    public static register(): void {        
        this.registerMonitors();
        this.registerProviders();
    }

    private static registerMonitors(): void {
        MonitorRepository.register(
            MONITOR_COLONY_DEFENSE,
            (mem: ColonyDefenseMonitorMemory) => ColonyDefenseMonitor.fromMemory(mem),
            () => new ColonyDefenseMonitor());

        MonitorRepository.register(
            MONITOR_ECONOMY_OPERATION,
            (mem: MonitorMemory) => EconomyOperationMonitor.fromMemory(mem),
            () => new EconomyOperationMonitor());

        MonitorRepository.register(
            MONITOR_INFRASTRUCTURE_OPERATION,
            (mem: MonitorMemory) => InfrastructureOperationMonitor.fromMemory(mem),
            () => new InfrastructureOperationMonitor());

        MonitorRepository.register(
            MONITOR_REMOTE_MINING_OPERATION,
            (mem: MonitorMemory) => RemoteMiningOperationMonitor.fromMemory(mem),
            () => new RemoteMiningOperationMonitor());
    }

    private static registerProviders(): void {
        MonitorProviderRepository.register(
            MONITOR_PROVIDER_STANDARD,
            () => new StandardColonyMonitorProvider());
    }
}
