import { Empire } from "./lib/empire/Empire";
import { UCreep } from "./lib/wrapper/Creep";

import { Cleaner } from "./lib/debug/Cleaner";
import { Logger } from "./lib/debug/Logger";
import { Reporter } from "./lib/debug/Reporter";
import { EventLog } from "./lib/util/EventLog";
import { Visuals } from "./lib/visual/Visuals";

declare global {
    const global: global;

    interface global {
        cleaner: Cleaner;
        logger: Logger;
        reports: Reporter;
        visuals: Visuals;
        events: EventLog;
        ucreep: UCreep;
        empire: Empire;
        pause(): void;
        reset(): void;

        TASK_IDLE: string;
        TASK_MOVE_TO: string;
        TASK_TRANSFER: string;
        TASK_WITHDRAW: string;
        TASK_BUILD: string;
        TASK_UPGRADE: string;

        OPERATION_STORAGE_CONSTRUCTION: string;
        OPERATION_TOWER_CONSTRUCTION: string;
        OPERATION_LIGHT_UPGRADE: string;
        OPERATION_HEAVY_UPGRADE: string;
        OPERATION_HARVEST_INFRASTRUCTURE: string;
        OPERATION_HARVEST: string;
        OPERATION_EXTENSION_CONSTRUCTION: string;
        OPERATION_ENERGY_TRANSPORT: string;
        OPERATION_CONTROLLER_INFRASTRUCTURE: string;
        OPERATION_BASIC_MAINTENANCE: string;

        PLAN_STANDARD: string;

        CONTROLLER_HARVESTER: string;
        CONTROLLER_INITIAL_INFRASTRUCTURE_BUILDER: string;
        CONTROLLER_LIGHT_UPGRADER: string;

        BODY_LIGHT_WORKER: string;
        BODY_HEAVY_HARVESTER: string;
        BODY_HEAVY_UPGRADER: string;
        BODY_HAULER: string;
        BODY_WARRIOR: string;
    }
}
