import { Empire } from "./lib/empire/Empire";
import { CreepUtility } from "./lib/creep/CreepUtility";

import { Cleaner } from "./lib/util/dbg/Cleaner";
import { Logger } from "./lib/util/dbg/Logger";
import { Reporter } from "./lib/util/reports/Reporter";
import { EventLog } from "./lib/util/EventLog";
import { Visuals } from "./lib/visual/Visuals";
import { Test } from "./lib/Test";
import { WatchVisual } from "./lib/visual/WatchVisual";
import { System } from "lib/System";


declare global {
    const global: global;
    const module: module;

    interface global {
        system: System;
        empire: Empire;

        reports: Reporter;
        r: Reporter;
        visuals: Visuals;
        v: Visuals;
        debug: WatchVisual;
        d: WatchVisual;

        events: EventLog;
        cleaner: Cleaner;
        logger: Logger;
        ucreep: CreepUtility;

        test: Test;

        help(): string;

        /** Uses Playback to pause script execution. */
        pause(): void;
        /** Uses Playback to start script execution. */
        start(): void;
        /** Uses Playback to execute script for one tick. */
        step(): void;

        /** Destroys all structures, suicides all creeps, reinitializes memory, clears all flags, resets the Empire object. */
        reset(): void;

        startFlagOp(flagName: string, type: FlagOperationType, hostColony: string): string;
        startFlagCampaign(flagName: string, type: FlagCampaignType, hostColony: string): string;
    }

    interface module {
        timestamp: number;
    }
}
