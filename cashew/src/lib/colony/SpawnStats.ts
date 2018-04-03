import { Nest } from "./Nest";

export class SpawnStatTracker {
    public static fromMemory(memory: SpawnStatTrackerMemory): SpawnStatTracker {
        let tracker = new this();
        tracker.currentPeriod = SpawnStats.fromMemory(memory.currentPeriod);
        tracker.history = memory.history.map(p => SpawnStats.fromMemory(p));
        return tracker;
    }

    constructor() {
        this.currentPeriod = new SpawnStats();
    }

    public history: SpawnStats[] = [];
    public currentPeriod: SpawnStats;

    public update(nest: Nest): void {
        if (this.currentPeriod.periodStart + this.currentPeriod.periodLength <= Game.time) {
            this.history.push(this.currentPeriod);
            if (this.history.length > 5)
                this.history.splice(0, 1);
            this.currentPeriod = new SpawnStats();
            this.currentPeriod.periodStart= Game.time;
        }

        let count = 0;
        for (var i = 0; i < nest.spawners.length; i++) {
            let s = nest.spawners[i];
            if (s.spawn.spawning || s.startedThisTick)
                count++;
        }
        count = (4 - nest.spawners.length) * count;
        this.currentPeriod.adjustedTicksSpentSpawning += count;
    }

    public getAverageSaturation(): number {
        let ticks = Game.time - this.currentPeriod.periodStart;
        let spawnTicks = this.currentPeriod.adjustedTicksSpentSpawning;
        for (var i = 0; i < this.history.length; i++) {
            ticks += this.history[i].periodLength;
            spawnTicks += this.history[i].adjustedTicksSpentSpawning;
        }

        return spawnTicks / (ticks * 3);
    }

    public save(): SpawnStatTrackerMemory {
        return {
            history: this.history.map(p => p.save()),
            currentPeriod: this.currentPeriod.save()
        };
    }
}

export class SpawnStats {
    public static fromMemory(memory: SpawnStatMemory): SpawnStats {
        let stats = new this();
        stats.periodStart = memory.periodStart;
        stats.adjustedTicksSpentSpawning = memory.adjustedTicksSpentSpawning;
        return stats;
    }

    public periodLength: number = 1500;
    public get saturation(): number {
        return this.adjustedTicksSpentSpawning / (Math.min(this.periodLength, Game.time - this.periodStart) * 3);
    }
    public periodStart: number;
    public adjustedTicksSpentSpawning: number = 0;

    public save(): SpawnStatMemory {
        return {
            periodStart: this.periodStart,
            adjustedTicksSpentSpawning: this.adjustedTicksSpentSpawning
        };
    }
}
