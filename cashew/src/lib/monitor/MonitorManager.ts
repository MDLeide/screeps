import { Monitor, MonitorStatus, TypedMonitor, MonitorRepository } from "./Monitor";
import { ITypedMonitorProvider, MonitorProviderRepository, IMonitorProvider } from "./MonitorProvider";


export class MonitorManager {
    public static fromMemory(memory: MonitorManagerMemory): MonitorManager {
        let provider = MonitorProviderRepository.getNew(memory.provider);
        let instance = new this(provider);
        for (var i = 0; i < memory.monitors.length; i++)
            instance.monitors.push(MonitorRepository.load(memory.monitors[i]));
        return instance;
    }

    protected provider: IMonitorProvider;

    constructor(provider: IMonitorProvider) {
        this.provider = provider;
    }

    public monitors: Monitor[] = [];

    public load(): void {
        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].load();
    }

    public update(context: any): void {
        this.provider.updateMonitors(this);
        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].update(context);
    }

    public execute(context: any): void {        
        for (var i = 0; i < this.monitors.length; i++) {            
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].execute(context);
            else if (this.monitors[i].status == MonitorStatus.Sleeping)
                this.monitors[i].tickSleeping();
        }
    }

    public cleanup(context: any): void {
        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].cleanup(context);
    }

    protected getMonitorMemory(): MonitorMemory[] {
        return this.monitors.map(p => p.save());
    }

    public save(): MonitorManagerMemory {
        return {
            monitors: this.getMonitorMemory(),
            provider: this.provider.type
        };
    }
}

export class TypedMonitorManager<T> extends MonitorManager {
    public static fromMemory<T>(memory: MonitorManagerMemory): TypedMonitorManager<T> {
        let provider = MonitorProviderRepository.getNew(memory.provider);
        let instance = new this(provider);
        for (var i = 0; i < memory.monitors.length; i++)
            instance.monitors.push(MonitorRepository.load(memory.monitors[i]));
        return instance;
    }
    
    constructor(provider: ITypedMonitorProvider<T>) {
        super(provider);
    }

    public monitors: TypedMonitor<T>[];

    public load(): void {
        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].load();
    }

    public update(context: T): void {
        this.provider.updateMonitors(this);

        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].update(context);
    }

    public execute(context: T): void {
        for (var i = 0; i < this.monitors.length; i++) {
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].execute(context);
            else if (this.monitors[i].status == MonitorStatus.Sleeping)
                this.monitors[i].tickSleeping();
        }
    }

    public cleanup(context: T): void {
        for (var i = 0; i < this.monitors.length; i++)
            if (this.monitors[i].status == MonitorStatus.Running)
                this.monitors[i].cleanup(context);
    }

    protected getMonitorMemory(): MonitorMemory[] {
        return this.monitors.map(p => p.save());
    }

    public save(): MonitorManagerMemory {
        return {
            monitors: this.getMonitorMemory(),
            provider: this.provider.type
        };
    }
}
