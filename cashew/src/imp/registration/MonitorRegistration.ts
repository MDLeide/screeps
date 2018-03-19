import { ColonyDefenseMonitor, ColonyDefenseMonitorMemory } from "../colony/militaryMonitors/ColonyDefenseMonitor";

import { ColonyMonitorRepository } from "../../lib/colony/ColonyMonitor";

export class MonitorRegistration {
    public static register():void {
        ColonyMonitorRepository.register(
            MONITOR_COLONY_DEFENSE,
            (mem: ColonyDefenseMonitorMemory) => ColonyDefenseMonitor.fromMemory(mem),
            () => new ColonyDefenseMonitor());
    }   
}
