export abstract class Monitor {
    public static fromMemory(memory: MonitorMemory, instance: Monitor): Monitor {
        instance.myType = memory.type;
        instance.myStatus = memory.status;
        instance.mySleepingFor = memory.sleepingFor;
        return instance;
    }

    private myStatus: MonitorStatus;
    private mySleepingFor: number;
    private myType: MonitorType;
    
    constructor(type: MonitorType) {
        this.myType = type;
        this.myStatus = MonitorStatus.Running;
    }

    public get type(): MonitorType {
        return this.myType;
    }
    public get status(): MonitorStatus {
        return this.myStatus;
    }
    public get sleepingFor(): number {
        return this.mySleepingFor;
    }

    public pause(): void {
        if (this.myStatus == MonitorStatus.Stopped)
            throw new Error("Cannot pause a stopped monitor.");

        this.myStatus = MonitorStatus.Paused;
    }

    public stop(): void {
        if (this.myStatus == MonitorStatus.Stopped)
            throw new Error("Cannot stop a stopped monitor.");

        this.myStatus = MonitorStatus.Stopped;
    }

    public sleep(ticks: number): void {
        if (this.myStatus == MonitorStatus.Stopped)
            throw new Error("Cannot sleep a stopped monitor.");        
        if (ticks < 1)
            throw new Error("Cannot sleep for less than 1 tick.");

        this.mySleepingFor = ticks;
        this.myStatus = MonitorStatus.Sleeping;
    }

    public start(): void {
        if (this.myStatus == MonitorStatus.Stopped)
            throw new Error("Cannot start a stopped monitor.");

        this.mySleepingFor = 0;
        this.myStatus = MonitorStatus.Running;
    }

    public tickSleeping(): void {
        if (this.mySleepingFor)
            this.mySleepingFor--;
    }

    public abstract load(): void;
    public abstract update(context: any): void;
    public abstract execute(context: any): void;
    public abstract cleanup(context: any): void;


    public save(): MonitorMemory {
        return {
            type: this.type,
            sleepingFor: this.sleepingFor,
            status: this.status
        };
    }
}

export abstract class TypedMonitor<T> extends Monitor {
    public abstract load(): void;
    public abstract update(context: T): void;
    public abstract execute(context: T): void;
    public abstract cleanup(context: T): void;
}

export enum MonitorStatus {
    Running,
    Paused,
    Sleeping,
    Stopped
}

export class MonitorRepository {
    public static register(monitorType: MonitorType, loadDelegate: (memory: MonitorMemory) => Monitor, newDelegate: () => Monitor) {
        this.loadDelegates[monitorType] = loadDelegate;
        this.newDelegates[monitorType] = newDelegate;
    }

    public static load(memory: MonitorMemory): Monitor {
        return this.loadDelegates[memory.type](memory);
    }

    public static getNew(monitorType: MonitorType): Monitor {
        return this.newDelegates[monitorType]();
    }

    private static loadDelegates: { [monitorType: string]: (memory: any) => Monitor } = {};
    private static newDelegates: { [monitorType: string]: () => Monitor } = {};
}
