import { MonitorManager, TypedMonitorManager } from "./MonitorManager";
import { MonitorRepository } from "./Monitor";

export interface IMonitorProvider {
    type: MonitorProviderType;
    updateMonitors(manager: MonitorManager): void;
}

export interface ITypedMonitorProvider<T> extends IMonitorProvider {
    updateMonitors(manager: TypedMonitorManager<T>): void;
}

export class MonitorProviderRepository {
    static newDelegates: { [type: string]: () => IMonitorProvider } = {};

    public static register(type: MonitorProviderType, delegate: () => IMonitorProvider): void {
        this.newDelegates[type] = delegate;
    }

    public static getNew(type: MonitorProviderType): IMonitorProvider {
        return this.newDelegates[type]();
    }
}

export abstract class MonitorProviderBase implements IMonitorProvider {
    constructor(type: MonitorProviderType) {
        this.type = type;
    }

    public type: MonitorProviderType;

    public abstract updateMonitors(manager: MonitorManager): void;

    protected ensureMonitor(type: MonitorType, count: number, manager: MonitorManager): void {
        let c = 0;
        for (var i = 0; i < manager.monitors.length; i++)
            if (manager.monitors[i].type == type)
                c++;

        while (c < count) {
            let monitor = MonitorRepository.getNew(type);
            manager.monitors.push(monitor);
            c++;
        }
    }
}
