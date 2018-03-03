declare const TASK_IDLE: "Idle";
declare const TASK_MOVE_TO: "MoveTo";
declare const TASK_TRANSFER: "Transfer";
declare const TASK_WITHDRAW: "Withdraw";
declare const TASK_BUILD: "Build";
declare const TASK_UPGRADE: "Upgrade";
declare const TASK_REPAIR: "Repair";
declare const TASK_ATTACK: "Attack";
declare const TASK_RESERVE: "Reserve";

declare const OPERATION_STORAGE_CONSTRUCTION: "StorageConstruction";
declare const OPERATION_TOWER_CONSTRUCTION: "TowerConstruction";
declare const OPERATION_LIGHT_UPGRADE: "LightUpgrade";
declare const OPERATION_HEAVY_UPGRADE: "HeavyUpgrade";
declare const OPERATION_HARVEST_INFRASTRUCTURE: "HarvestInfrastructure";
declare const OPERATION_HARVEST: "Harvest";
declare const OPERATION_EXTENSION_CONSTRUCTION: "ExtensionConstruction";
declare const OPERATION_ENERGY_TRANSPORT: "EnergyTransport";
declare const OPERATION_CONTROLLER_INFRASTRUCTURE: "ControllerInfrastructure";
declare const OPERATION_BASIC_MAINTENANCE: "BasicMaintenance";
declare const OPERATION_REMOTE_HARVEST_SCOUT: "RemoteHarvestScout";
declare const OPERATION_REMOTE_HARVEST: "RemoteHarvest";
declare const OPERATION_HARVEST_LINK_CONSTRUCTION: "HarvestLinkConstruction";
declare const OPERATION_UPGRADE_LINK_CONSTRUCTION: "UpgradeLinkConstruction";
declare const OPERATION_EXTENSION_LINK_CONSTRUCTION: "ExtensionLinkConstruction";
declare const OPERATION_LAB_CONSTRUCTION: "LabConstruction";
declare const OPERATION_EXTRACTOR_CONSTRUCTION: "ExtractorConstruction";
declare const OPERATION_EXTRACTION: "Extraction";
declare const OPERATION_EXTENSION_FILL: "ExtensionFill";
declare const OPERATION_TERMINAL_CONSTRUCTION: "TerminalConstruction";
declare const OPERATION_OBSERVER_CONSTRUCTION: "ObserverConstruction";
declare const OPERATION_STORAGE_LINK_CONSTRUCTION: "StorageLinkConstruction";

declare const PROGRESS_STANDARD: "Standard";

declare const PLAN_INFRASTRUCTURE: "Infrastructure";
declare const PLAN_ECONOMY: "Economy";
declare const PLAN_REMOTE_MINING: "RemoteMining";

declare const CREEP_CONTROLLER_HARVESTER: "Harvester";
declare const CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER: "HarvestInfrastructureBuilder";
declare const CREEP_CONTROLLER_LIGHT_UPGRADER: "LightUpgrader";
declare const CREEP_CONTROLLER_BUILDER: "Builder";
declare const CREEP_CONTROLLER_HAULER: "Hauler";
declare const CREEP_CONTROLLER_UPGRADER: "Upgrader";
declare const CREEP_CONTROLLER_REMOTE_HAULER: "RemoteHauler";
declare const CREEP_CONTROLLER_REMOTE_HARVESTER: "RemoteHarvester";

declare const BODY_LIGHT_WORKER: "LightWorker";
declare const BODY_HEAVY_HARVESTER: "HeavyHarvester";
declare const BODY_HEAVY_UPGRADER: "HeavyUpgrader";
declare const BODY_HAULER: "Hauler";
declare const BODY_WARRIOR: "Warrior";
declare const BODY_SCOUT: "Scout";

type TASK_IDLE = "Idle";
type TASK_MOVE_TO = "MoveTo";
type TASK_TRANSFER = "Transfer";
type TASK_WITHDRAW = "Withdraw";
type TASK_BUILD = "Build";
type TASK_UPGRADE = "Upgrade";
type TASK_REPAIR = "Repair";
type TASK_ATTACK = "Attack";
type TASK_RESERVE = "Reserve";

type OPERATION_STORAGE_CONSTRUCTION = "StorageConstruction";
type OPERATION_TOWER_CONSTRUCTION = "TowerConstruction";
type OPERATION_LIGHT_UPGRADE = "LightUpgrade";
type OPERATION_HEAVY_UPGRADE = "HeavyUpgrade";
type OPERATION_HARVEST_INFRASTRUCTURE = "HarvestInfrastructure";
type OPERATION_HARVEST = "Harvest";
type OPERATION_EXTENSION_CONSTRUCTION = "ExtensionConstruction";
type OPERATION_ENERGY_TRANSPORT = "EnergyTransport";
type OPERATION_CONTROLLER_INFRASTRUCTURE = "ControllerInfrastructure";
type OPERATION_BASIC_MAINTENANCE = "BasicMaintenance";
type OPERATION_REMOTE_HARVEST_SCOUT = "RemoteHarvestScout";
type OPERATION_REMOTE_HARVEST = "RemoteHarvest";
type OPERATION_HARVEST_LINK_CONSTRUCTION = "HarvestLinkConstruction";
type OPERATION_UPGRADE_LINK_CONSTRUCTION = "UpgradeLinkConstruction";
type OPERATION_EXTENSION_LINK_CONSTRUCTION = "ExtensionLinkConstruction";
type OPERATION_LAB_CONSTRUCTION = "LabConstruction";
type OPERATION_EXTRACTOR_CONSTRUCTION = "ExtractorConstruction";
type OPERATION_EXTRACTION = "Extraction";
type OPERATION_EXTENSION_FILL = "ExtensionFill";
type OPERATION_TERMINAL_CONSTRUCTION = "TerminalConstruction";
type OPERATION_OBSERVER_CONSTRUCTION = "ObserverConstruction";
type OPERATION_STORAGE_LINK_CONSTRUCTION = "StorageLinkConstruction";

type PROGRESS_STANDARD = "Standard";

type PLAN_INFRASTRUCTURE = "Infrastructure";
type PLAN_ECONOMY = "Economy";
type PLAN_REMOTE_MINING = "RemoteMining";

type CREEP_CONTROLLER_HARVESTER = "Harvester";
type CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER = "HarvestInfrastructureBuilder";
type CREEP_CONTROLLER_LIGHT_UPGRADER = "LightUpgrader";
type CREEP_CONTROLLER_BUILDER = "Builder";
type CREEP_CONTROLLER_HAULER = "Hauler";
type CREEP_CONTROLLER_UPGRADER = "Upgrader";
type CREEP_CONTROLLER_REMOTE_HAULER = "RemoteHauler";
type CREEP_CONTROLLER_REMOTE_HARVESTER = "RemoteHarvester";

type BODY_LIGHT_WORKER = "LightWorker";
type BODY_HEAVY_HARVESTER = "HeavyHarvester";
type BODY_HEAVY_UPGRADER = "HeavyUpgrader";
type BODY_HAULER = "Hauler";
type BODY_WARRIOR = "Warrior";
type BODY_SCOUT = "Scout";

type TaskType =
    TASK_IDLE |
    TASK_MOVE_TO |
    TASK_TRANSFER |
    TASK_WITHDRAW |
    TASK_BUILD |
    TASK_UPGRADE |
    TASK_REPAIR |
    TASK_ATTACK |
    TASK_RESERVE;

type OperationType =
    OPERATION_STORAGE_CONSTRUCTION |
    OPERATION_TOWER_CONSTRUCTION |
    OPERATION_LIGHT_UPGRADE |
    OPERATION_HEAVY_UPGRADE |
    OPERATION_HARVEST_INFRASTRUCTURE |
    OPERATION_HARVEST |
    OPERATION_EXTENSION_CONSTRUCTION |
    OPERATION_ENERGY_TRANSPORT |
    OPERATION_CONTROLLER_INFRASTRUCTURE |
    OPERATION_BASIC_MAINTENANCE |
    OPERATION_REMOTE_HARVEST_SCOUT |
    OPERATION_REMOTE_HARVEST |
    OPERATION_HARVEST_LINK_CONSTRUCTION |
    OPERATION_UPGRADE_LINK_CONSTRUCTION |
    OPERATION_EXTENSION_LINK_CONSTRUCTION |
    OPERATION_LAB_CONSTRUCTION |
    OPERATION_EXTRACTOR_CONSTRUCTION |
    OPERATION_EXTRACTION |
    OPERATION_EXTENSION_FILL |
    OPERATION_TERMINAL_CONSTRUCTION |
    OPERATION_OBSERVER_CONSTRUCTION |
    OPERATION_STORAGE_LINK_CONSTRUCTION;

type ProgressType =
    PROGRESS_STANDARD;

type PlanType =
    PLAN_INFRASTRUCTURE |
    PLAN_ECONOMY |
    PLAN_REMOTE_MINING;

type CreepControllerType =
    CREEP_CONTROLLER_HARVESTER |
    CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER |
    CREEP_CONTROLLER_LIGHT_UPGRADER |
    CREEP_CONTROLLER_BUILDER |
    CREEP_CONTROLLER_HAULER |
    CREEP_CONTROLLER_UPGRADER |
    CREEP_CONTROLLER_REMOTE_HAULER |
    CREEP_CONTROLLER_REMOTE_HARVESTER;

type BodyType =
    BODY_LIGHT_WORKER |
    BODY_HEAVY_HARVESTER |
    BODY_HEAVY_UPGRADER |
    BODY_HAULER |
    BODY_WARRIOR |
    BODY_SCOUT;

