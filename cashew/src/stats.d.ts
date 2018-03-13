import { Statistics } from "./lib/Stats";

declare global {
    interface global {
        stats: Statistics;
        LastMemory: Memory;
        Memory: Memory;
    }

    interface RawMemory {
        _parsed: Memory;
    }

    interface CPU {
        getHeapStatistics(): any;
    }
}
