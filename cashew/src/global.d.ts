import { Empire } from "./lib/empire/Empire";
import { CreepUtility } from "./lib/creep/CreepUtility";

import { Cleaner } from "./lib/util/dbg/Cleaner";
import { Logger } from "./lib/util/dbg/Logger";
import { Reporter } from "./lib/util/reports/Reporter";
import { EventLog } from "./lib/util/EventLog";
import { Visuals } from "./lib/util/visual/Visuals";
import { Test } from "./lib/Test";

declare global {
    const global: global;

    interface global {
        cleaner: Cleaner;
        logger: Logger;
        reports: Reporter;
        r: Reporter;
        visuals: Visuals;
        v: Visuals;
        events: EventLog;
        ucreep: CreepUtility;
        empire: Empire;
        test: Test;
        help(): string;
        pause(): void;
        reset(): void;
    }
}
