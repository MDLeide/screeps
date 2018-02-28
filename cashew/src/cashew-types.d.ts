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

declare const PROGRESS_STANDARD: "Standard";

declare const PLAN_INFRASTRUCTURE: "Infrastructure";
declare const PLAN_ECONOMY: "Economy";

declare const CREEP_CONTROLLER_HARVESTER: "Harvester";
declare const CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER: "HarvestInfrastructureBuilder";
declare const CREEP_CONTROLLER_LIGHT_UPGRADER: "LightUpgrader";
declare const CREEP_CONTROLLER_BUILDER: "Builder";
declare const CREEP_CONTROLLER_HAULER: "Hauler";
declare const CREEP_CONTROLLER_UPGRADER: "Upgrader";

declare const BODY_LIGHT_WORKER: "LightWorker";
declare const BODY_HEAVY_HARVESTER: "HeavyHarvester";
declare const BODY_HEAVY_UPGRADER: "HeavyUpgrader";
declare const BODY_HAULER: "Hauler";
declare const BODY_WARRIOR: "Warrior";

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

type PROGRESS_STANDARD = "Standard";

type PLAN_INFRASTRUCTURE = "Infrastructure";
type PLAN_ECONOMY = "Economy";

type CREEP_CONTROLLER_HARVESTER = "Harvester";
type CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER = "HarvestInfrastructureBuilder";
type CREEP_CONTROLLER_LIGHT_UPGRADER = "LightUpgrader";
type CREEP_CONTROLLER_BUILDER = "Builder";
type CREEP_CONTROLLER_HAULER = "Hauler";
type CREEP_CONTROLLER_UPGRADER = "Upgrader";

type BODY_LIGHT_WORKER = "LightWorker";
type BODY_HEAVY_HARVESTER = "HeavyHarvester";
type BODY_HEAVY_UPGRADER = "HeavyUpgrader";
type BODY_HAULER = "Hauler";
type BODY_WARRIOR = "Warrior";

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
    OPERATION_BASIC_MAINTENANCE;

type ProgressType =
    PROGRESS_STANDARD;

type PlanType =
    PLAN_INFRASTRUCTURE |
    PLAN_ECONOMY;

type ControllerType =
    CREEP_CONTROLLER_HARVESTER |
    CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER |
    CREEP_CONTROLLER_LIGHT_UPGRADER |
    CREEP_CONTROLLER_BUILDER |
    CREEP_CONTROLLER_HAULER |
    CREEP_CONTROLLER_UPGRADER;

type BodyType =
    BODY_LIGHT_WORKER |
    BODY_HEAVY_HARVESTER |
    BODY_HEAVY_UPGRADER |
    BODY_HAULER |
    BODY_WARRIOR;
