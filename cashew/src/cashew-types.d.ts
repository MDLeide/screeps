declare const TASK_IDLE: "Idle";
declare const TASK_MOVE_TO: "MoveTo";
declare const TASK_TRANSFER: "Transfer";
declare const TASK_WITHDRAW: "Withdraw";
declare const TASK_BUILD: "Build";
declare const TASK_UPGRADE: "Upgrade";

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

declare const PLAN_STANDARD: "Standard";

declare const CONTROLLER_HARVESTER: "Harvester";
declare const CONTROLLER_INITIAL_INFRASTRUCTURE_BUILDER: "InitialInfrastructureBuilder";
declare const CONTROLLER_LIGHT_UPGRADER: "LightUpgrader";


type TASK_IDLE = "Idle";
type TASK_MOVE_TO = "MoveTo";
type TASK_TRANSFER = "Transfer";
type TASK_WITHDRAW = "Withdraw";
type TASK_BUILD = "Build";
type TASK_UPGRADE = "Upgrade";

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

type PLAN_STANDARD = "Standard";

type CONTROLLER_HARVESTER = "Harvester";
type CONTROLLER_INITIAL_INFRASTRUCTURE_BUILDER = "InitialInfrastructureBuilder";
type CONTROLLER_LIGHT_UPGRADER = "LightUpgrader";

type TaskType =
    TASK_IDLE |
    TASK_MOVE_TO |
    TASK_TRANSFER |
    TASK_WITHDRAW |
    TASK_BUILD |
    TASK_UPGRADE;

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

type ColonyPlanType =
    PLAN_STANDARD;

type ControllerType =
    CONTROLLER_HARVESTER |
    CONTROLLER_INITIAL_INFRASTRUCTURE_BUILDER |
    CONTROLLER_LIGHT_UPGRADER;
