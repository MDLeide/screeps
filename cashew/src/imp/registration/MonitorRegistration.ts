import { ColonyDefenseMonitor, ColonyDefenseMonitorMemory } from "../colony/militaryMonitors/ColonyDefenseMonitor";
import { MonitorRepository } from "lib/monitor/Monitor";
import { EconomyOperationMonitor } from "../colony/EconomyOperationMonitor";
import { InfrastructureOperationMonitor } from "../colony/InfrastructureOperationMonitor";
import { MonitorProviderRepository } from "lib/monitor/MonitorProvider";
import { StandardColonyMonitorProvider } from "../colony/StandardColonyMonitorProvider";
import { StandardEmpireMonitorProvider } from "../empire/StandardEmpireMonitorProvider";
import { ExchangeMonitor } from "../empire/ExchangeMonitor";
import { ColonyResourcesMonitor } from "../colony/ColonyResourcesMonitor";
import { RemoteMiningMonitor } from "../empire/RemoteMiningMonitor";

//import { ColonyMonitorRepository } from "../../lib/colony/ColonyMonitor";

export class MonitorRegistration {
    public static register(): void {        
        this.registerProviders();
        this.registerEmpireMonitors();
        this.registerColonyMonitors();        
    }

    private static registerProviders(): void {
        MonitorProviderRepository.register(
            MONITOR_PROVIDER_COLONY_STANDARD,
            () => new StandardColonyMonitorProvider());

        MonitorProviderRepository.register(
            MONITOR_PROVIDER_EMPIRE_STANDARD,
            () => new StandardEmpireMonitorProvider());
    }

    private static registerEmpireMonitors(): void {
        MonitorRepository.register(
            MONITOR_EXCHANGE,
            (mem: MonitorMemory) => ExchangeMonitor.fromMemory(mem),
            () => new ExchangeMonitor());

        MonitorRepository.register(
            MONITOR_REMOTE_MINING,
            (mem: MonitorMemory) => RemoteMiningMonitor.fromMemory(mem),
            () => new RemoteMiningMonitor());
    }

    private static registerColonyMonitors(): void {
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
            MONITOR_COLONY_RESOURCES,
            (mem: MonitorMemory) => ColonyResourcesMonitor.fromMemory(mem),
            () => new ColonyResourcesMonitor());
    }    
}
