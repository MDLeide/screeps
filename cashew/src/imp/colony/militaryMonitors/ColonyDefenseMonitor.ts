import { RoomHelper } from "../../../lib/util/RoomHelper";

import { BodyRepository } from "../../creep/BodyRepository";
import { Colony } from "../../../lib/colony/Colony";
import { ColonyMonitor } from "../../../lib/colony/ColonyMonitor";

import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

export class ColonyDefenseMonitor extends ColonyMonitor {
    public static fromMemory(memory: ColonyDefenseMonitorMemory): ColonyDefenseMonitor {
        let monitor = new this();
        return ColonyMonitor.fromMemory(memory, monitor) as ColonyDefenseMonitor;
    }

    constructor() {
        super(MONITOR_COLONY_DEFENSE);
    }
    
    public load(): void {
    }

    public update(colony: Colony): void {        
    }

    public execute(colony: Colony): void {
    }

    public cleanup(colony: Colony): void {
    }
}

export interface ColonyDefenseMonitorMemory extends ColonyMonitorMemory {
    
}
