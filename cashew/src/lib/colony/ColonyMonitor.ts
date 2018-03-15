import { Colony } from "./Colony";

export abstract class ColonyMonitor {
    public static fromMemory(memory: ColonyMonitorMemory, instance: ColonyMonitor): ColonyMonitor {
        instance.type = memory.type;
        return instance;
    }

    constructor(type: MonitorType) {
        this.type = type;
    }

    public type: MonitorType;

    public abstract load(): void;
    public abstract update(colony: Colony): void;
    public abstract execute(colony: Colony): void;
    public abstract cleanup(colony: Colony): void;

    public save(): ColonyMonitorMemory {
        return {
            type: this.type
        };
    }
}

export class ColonyMonitorRepository {
    public static register(monitorType: MonitorType, loadDelegate: (memory: ColonyMonitorMemory) => ColonyMonitor, newDelegate: () => ColonyMonitor) {
        this.loadDelegates[monitorType] = loadDelegate;
        this.newDelegates[monitorType] = newDelegate;
    }

    public static load(memory: ColonyMonitorMemory): ColonyMonitor {
        return this.loadDelegates[memory.type](memory);
    }

    public static getNew(monitorType: MonitorType): ColonyMonitor {
        return this.newDelegates[monitorType]();
    }

    private static loadDelegates: { [monitorType: string]: (memory: any) => ColonyMonitor } = {};
    private static newDelegates: { [monitorType: string]: () => ColonyMonitor } = {};
}
