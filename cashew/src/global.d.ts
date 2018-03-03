import { Empire } from "./lib/empire/Empire";
import { CreepUtility } from "./lib/creep/CreepUtility";

import { Cleaner } from "./lib/util/dbg/Cleaner";
import { Logger } from "./lib/util/dbg/Logger";
import { Reporter } from "./lib/util/reports/Reporter";
import { EventLog } from "./lib/util/EventLog";
import { Visuals } from "./lib/util/visual/Visuals";

declare global {
    const global: global;

    interface global {
        cleaner: Cleaner;
        logger: Logger;
        reports: Reporter;
        visuals: Visuals;
        events: EventLog;
        ucreep: CreepUtility;
        empire: Empire;
        help(): string;
        pause(): void;
        reset(): void;

        // constants below

        TASK_IDLE: string;
        TASK_MOVE_TO: string;
        TASK_TRANSFER: string;
        TASK_WITHDRAW: string;
        TASK_BUILD: string;
        TASK_UPGRADE: string;
        TASK_REPAIR: string;
        TASK_ATTACK: string;
        TASK_RESERVE: string;

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
        OPERATION_REMOTE_HARVEST_SCOUT: string;
        OPERATION_REMOTE_HARVEST: string;
        OPERATION_HARVEST_LINK_CONSTRUCTION: string;
        OPERATION_UPGRADE_LINK_CONSTRUCTION: string;
        OPERATION_EXTENSION_LINK_CONSTRUCTION: string;
        OPERATION_LAB_CONSTRUCTION: string;
        OPERATION_EXTRACTOR_CONSTRUCTION: string;
        OPERATION_EXTRACTION: string;
        OPERATION_EXTENSION_FILL: string;
        OPERATION_TERMINAL_CONSTRUCTION: string;
        OPERATION_OBSERVER_CONSTRUCTION: string;
        OPERATION_STORAGE_LINK_CONSTRUCTION: string;

        PROGRESS_STANDARD: string;

        PLAN_INFRASTRUCTURE: string;
        PLAN_ECONOMY: string;
        PLAN_REMOTE_MINING: string;

        CREEP_CONTROLLER_HARVESTER: string;
        CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER: string;
        CREEP_CONTROLLER_LIGHT_UPGRADER: string;
        CREEP_CONTROLLER_BUILDER: string;
        CREEP_CONTROLLER_HAULER: string;
        CREEP_CONTROLLER_UPGRADER: string;
        CREEP_CONTROLLER_REMOTE_HAULER: string;
        CREEP_CONTROLLER_REMOTE_HARVESTER: string;

        BODY_LIGHT_WORKER: string;
        BODY_HEAVY_HARVESTER: string;
        BODY_HEAVY_UPGRADER: string;
        BODY_HAULER: string;
        BODY_WARRIOR: string;
        BODY_SCOUT: string;
    }
}
