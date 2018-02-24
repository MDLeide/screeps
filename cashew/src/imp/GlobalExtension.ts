import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";
import { Logger } from "../lib/debug/Logger";

import { EventLog } from "../lib/util/EventLog";
import { Visuals } from "../lib/visual/Visuals";
import { UCreep } from "../lib/wrapper/Creep";

export class GlobalExtension {
    public static extend() {
        global.cleaner = new Cleaner();
        global.logger = new Logger();
        global.visuals = new Visuals();
        global.events = new EventLog();
        global.ucreep = new UCreep();

        global.pause = function () { Playback.pause(); }
        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }

        global.TASK_IDLE = "Idle";
        global.TASK_MOVE_TO = "MoveTo";
        global.TASK_TRANSFER = "Transfer";
        global.TASK_WITHDRAW = "Withdraw";
        global.TASK_BUILD = "Build";
        global.TASK_UPGRADE = "Upgrade";

        global.OPERATION_STORAGE_CONSTRUCTION = "StorageConstruction";
        global.OPERATION_TOWER_CONSTRUCTION = "TowerConstruction";
        global.OPERATION_LIGHT_UPGRADE = "LightUpgrade";
        global.OPERATION_HEAVY_UPGRADE = "HeavyUpgrade";
        global.OPERATION_HARVEST_INFRASTRUCTURE = "HarvestInfrastructure";
        global.OPERATION_HARVEST = "Harvest";
        global.OPERATION_EXTENSION_CONSTRUCTION = "ExtensionConstruction";
        global.OPERATION_ENERGY_TRANSPORT = "EnergyTransport";
        global.OPERATION_CONTROLLER_INFRASTRUCTURE = "ControllerInfrastructure";
        global.OPERATION_BASIC_MAINTENANCE = "BasicMaintenance";

        global.PLAN_STANDARD = "Standard";

        global.CONTROLLER_HARVESTER = "Harvester";
        global.CONTROLLER_INITIAL_INFRASTRUCTURE_BUILDER = "InitialInfrastructureBuilder";
        global.CONTROLLER_LIGHT_UPGRADER = "LightUpgrader";
    }
}
