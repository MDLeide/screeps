declare const FLAG_OPERATION: "Operation";
declare const FLAG_COLONY: "Colony";
declare const FLAG_CAMPAIGN: "Campaign";
declare const FLAG_MARKER: "Marker";

declare const TASK_IDLE: "Idle";
declare const TASK_MOVE_TO: "MoveTo";
declare const TASK_TRANSFER: "Transfer";
declare const TASK_WITHDRAW: "Withdraw";
declare const TASK_BUILD: "Build";
declare const TASK_UPGRADE: "Upgrade";
declare const TASK_REPAIR: "Repair";
declare const TASK_ATTACK: "Attack";
declare const TASK_RESERVE: "Reserve";
declare const TASK_CLAIM: "Claim";
declare const TASK_HARVEST: "Harvest";

declare const OPERATION_LIGHT_UPGRADE: "LightUpgrade";
declare const OPERATION_HEAVY_UPGRADE: "HeavyUpgrade";
declare const OPERATION_HARVEST: "Harvest";
declare const OPERATION_REMOTE_HARVEST_SCOUT: "RemoteHarvestScout";
declare const OPERATION_REMOTE_HARVEST: "RemoteHarvest";
declare const OPERATION_ENERGY_TRANSPORT: "EnergyTransport";
declare const OPERATION_EXTRACTION: "Extraction";
declare const OPERATION_EXTENSION_FILL: "ExtensionFill";
declare const OPERATION_STORAGE_CONSTRUCTION: "StorageConstruction";
declare const OPERATION_TOWER_CONSTRUCTION: "TowerConstruction";
declare const OPERATION_HARVEST_INFRASTRUCTURE: "HarvestInfrastructure";
declare const OPERATION_EXTENSION_CONSTRUCTION: "ExtensionConstruction";
declare const OPERATION_CONTROLLER_INFRASTRUCTURE: "ControllerInfrastructure";
declare const OPERATION_HARVEST_LINK_CONSTRUCTION: "HarvestLinkConstruction";
declare const OPERATION_UPGRADE_LINK_CONSTRUCTION: "UpgradeLinkConstruction";
declare const OPERATION_EXTENSION_LINK_CONSTRUCTION: "ExtensionLinkConstruction";
declare const OPERATION_ROOM_DEFENSE: "RoomDefense";
declare const OPERATION_LAB_CONSTRUCTION: "LabConstruction";
declare const OPERATION_EXTRACTOR_CONSTRUCTION: "ExtractorConstruction";
declare const OPERATION_TERMINAL_CONSTRUCTION: "TerminalConstruction";
declare const OPERATION_OBSERVER_CONSTRUCTION: "ObserverConstruction";
declare const OPERATION_STORAGE_LINK_CONSTRUCTION: "StorageLinkConstruction";
declare const OPERATION_WALL_CONSTRUCTION: "WallConstruction";
declare const OPERATION_ROAD_CONSTRUCTION: "RoadConstruction";
declare const OPERATION_SPAWN_CONSTRUCTION: "SpawnConstruction";
declare const OPERATION_REPLACE_ORIGINAL_SPAWN: "ReplaceOriginalSpawn";
declare const OPERATION_ROOM_SCOUT: "RoomScout";
declare const OPERATION_NEW_SPAWN_CONSTRUCTION: "NewSpawnConstruction";
declare const OPERATION_RESERVATION: "Reservation";

declare const PROGRESS_STANDARD: "Standard";

declare const PLAN_INFRASTRUCTURE: "Infrastructure";
declare const PLAN_ECONOMY: "Economy";
declare const PLAN_REMOTE_MINING: "RemoteMining";
declare const PLAN_ROAD: "Road";
declare const PLAN_DEFENSE: "Defense";

declare const CREEP_CONTROLLER_HARVESTER: "Harvester";
declare const CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER: "HarvestInfrastructureBuilder";
declare const CREEP_CONTROLLER_LIGHT_UPGRADER: "LightUpgrader";
declare const CREEP_CONTROLLER_BUILDER: "Builder";
declare const CREEP_CONTROLLER_HAULER: "Hauler";
declare const CREEP_CONTROLLER_UPGRADER: "Upgrader";
declare const CREEP_CONTROLLER_REMOTE_HAULER: "RemoteHauler";
declare const CREEP_CONTROLLER_REMOTE_HARVESTER: "RemoteHarvester";
declare const CREEP_CONTROLLER_EXTRACTOR: "Extractor";
declare const CREEP_CONTROLLER_FILLER: "Filler";
declare const CREEP_CONTROLLER_CHEMIST: "Chemist";
declare const CREEP_CONTROLLER_MASON: "Mason";
declare const CREEP_CONTROLLER_REPAIR: "Repair";
declare const CREEP_CONTROLLER_DEFENDER: "Defender";
declare const CREEP_CONTROLLER_CLAIM: "Claim";
declare const CREEP_CONTROLLER_SCOUT: "Scout";
declare const CREEP_CONTROLLER_RESERVE: "Reserve";
declare const CREEP_CONTROLLER_WARRIOR: "Warrior";

declare const BODY_LIGHT_WORKER: "LightWorker";
declare const BODY_HEAVY_HARVESTER: "HeavyHarvester";
declare const BODY_HEAVY_UPGRADER: "HeavyUpgrader";
declare const BODY_HAULER: "Hauler";
declare const BODY_WARRIOR: "Warrior";
declare const BODY_SCOUT: "Scout";
declare const BODY_DEFENDER: "Defender";
declare const BODY_CLAIMER: "Claimer";
declare const BODY_RANGER: "Ranger";
declare const BODY_HEALER: "Healer";
declare const BODY_HOPLITE: "Hoplite";
declare const BODY_SHIELD: "Shield";

declare const MONITOR_COLONY_DEFENSE: "ColonyDefense";

declare const UNIT_MEMBER_HOPLITE: "Hoplite";
declare const UNIT_MEMBER_RANGER: "Ranger";
declare const UNIT_MEMBER_HEALER: "Healer";
declare const UNIT_MEMBER_SHIELD: "Shield";
declare const UNIT_MEMBER_WARRIOR: "Warrior";

declare const FORMATION_STANDARD: "Standard";

declare const TARGETING_TACTICS_STANDARD: "Standard";

type FLAG_OPERATION = "Operation";
type FLAG_COLONY = "Colony";
type FLAG_CAMPAIGN = "Campaign";
type FLAG_MARKER = "Marker";

type TASK_IDLE = "Idle";
type TASK_MOVE_TO = "MoveTo";
type TASK_TRANSFER = "Transfer";
type TASK_WITHDRAW = "Withdraw";
type TASK_BUILD = "Build";
type TASK_UPGRADE = "Upgrade";
type TASK_REPAIR = "Repair";
type TASK_ATTACK = "Attack";
type TASK_RESERVE = "Reserve";
type TASK_CLAIM = "Claim";
type TASK_HARVEST = "Harvest";

type OPERATION_LIGHT_UPGRADE = "LightUpgrade";
type OPERATION_HEAVY_UPGRADE = "HeavyUpgrade";
type OPERATION_HARVEST = "Harvest";
type OPERATION_REMOTE_HARVEST_SCOUT = "RemoteHarvestScout";
type OPERATION_REMOTE_HARVEST = "RemoteHarvest";
type OPERATION_ENERGY_TRANSPORT = "EnergyTransport";
type OPERATION_EXTRACTION = "Extraction";
type OPERATION_EXTENSION_FILL = "ExtensionFill";
type OPERATION_STORAGE_CONSTRUCTION = "StorageConstruction";
type OPERATION_TOWER_CONSTRUCTION = "TowerConstruction";
type OPERATION_HARVEST_INFRASTRUCTURE = "HarvestInfrastructure";
type OPERATION_EXTENSION_CONSTRUCTION = "ExtensionConstruction";
type OPERATION_CONTROLLER_INFRASTRUCTURE = "ControllerInfrastructure";
type OPERATION_HARVEST_LINK_CONSTRUCTION = "HarvestLinkConstruction";
type OPERATION_UPGRADE_LINK_CONSTRUCTION = "UpgradeLinkConstruction";
type OPERATION_EXTENSION_LINK_CONSTRUCTION = "ExtensionLinkConstruction";
type OPERATION_ROOM_DEFENSE = "RoomDefense";
type OPERATION_LAB_CONSTRUCTION = "LabConstruction";
type OPERATION_EXTRACTOR_CONSTRUCTION = "ExtractorConstruction";
type OPERATION_TERMINAL_CONSTRUCTION = "TerminalConstruction";
type OPERATION_OBSERVER_CONSTRUCTION = "ObserverConstruction";
type OPERATION_STORAGE_LINK_CONSTRUCTION = "StorageLinkConstruction";
type OPERATION_WALL_CONSTRUCTION = "WallConstruction";
type OPERATION_ROAD_CONSTRUCTION = "RoadConstruction";
type OPERATION_SPAWN_CONSTRUCTION = "SpawnConstruction";
type OPERATION_REPLACE_ORIGINAL_SPAWN = "ReplaceOriginalSpawn";
type OPERATION_ROOM_SCOUT = "RoomScout";
type OPERATION_NEW_SPAWN_CONSTRUCTION = "NewSpawnConstruction";
type OPERATION_RESERVATION = "Reservation";

type PROGRESS_STANDARD = "Standard";

type PLAN_INFRASTRUCTURE = "Infrastructure";
type PLAN_ECONOMY = "Economy";
type PLAN_REMOTE_MINING = "RemoteMining";
type PLAN_ROAD = "Road";
type PLAN_DEFENSE = "Defense";

type CREEP_CONTROLLER_HARVESTER = "Harvester";
type CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER = "HarvestInfrastructureBuilder";
type CREEP_CONTROLLER_LIGHT_UPGRADER = "LightUpgrader";
type CREEP_CONTROLLER_BUILDER = "Builder";
type CREEP_CONTROLLER_HAULER = "Hauler";
type CREEP_CONTROLLER_UPGRADER = "Upgrader";
type CREEP_CONTROLLER_REMOTE_HAULER = "RemoteHauler";
type CREEP_CONTROLLER_REMOTE_HARVESTER = "RemoteHarvester";
type CREEP_CONTROLLER_EXTRACTOR = "Extractor";
type CREEP_CONTROLLER_FILLER = "Filler";
type CREEP_CONTROLLER_CHEMIST = "Chemist";
type CREEP_CONTROLLER_MASON = "Mason";
type CREEP_CONTROLLER_REPAIR = "Repair";
type CREEP_CONTROLLER_DEFENDER = "Defender";
type CREEP_CONTROLLER_CLAIM = "Claim";
type CREEP_CONTROLLER_SCOUT = "Scout";
type CREEP_CONTROLLER_RESERVE = "Reserve";
type CREEP_CONTROLLER_WARRIOR = "Warrior";

type BODY_LIGHT_WORKER = "LightWorker";
type BODY_HEAVY_HARVESTER = "HeavyHarvester";
type BODY_HEAVY_UPGRADER = "HeavyUpgrader";
type BODY_HAULER = "Hauler";
type BODY_WARRIOR = "Warrior";
type BODY_SCOUT = "Scout";
type BODY_DEFENDER = "Defender";
type BODY_CLAIMER = "Claimer";
type BODY_RANGER = "Ranger";
type BODY_HEALER = "Healer";
type BODY_HOPLITE = "Hoplite";
type BODY_SHIELD = "Shield";

type MONITOR_COLONY_DEFENSE = "ColonyDefense";

type UNIT_MEMBER_HOPLITE = "Hoplite";
type UNIT_MEMBER_RANGER = "Ranger";
type UNIT_MEMBER_HEALER = "Healer";
type UNIT_MEMBER_SHIELD = "Shield";
type UNIT_MEMBER_WARRIOR = "Warrior";

type FORMATION_STANDARD = "Standard";

type TARGETING_TACTICS_STANDARD = "Standard";

type FlagType =
    FLAG_OPERATION |
    FLAG_COLONY |
    FLAG_CAMPAIGN |
    FLAG_MARKER;

type TaskType =
    TASK_IDLE |
    TASK_MOVE_TO |
    TASK_TRANSFER |
    TASK_WITHDRAW |
    TASK_BUILD |
    TASK_UPGRADE |
    TASK_REPAIR |
    TASK_ATTACK |
    TASK_RESERVE |
    TASK_CLAIM |
    TASK_HARVEST;

type OperationType =
    OPERATION_LIGHT_UPGRADE |
    OPERATION_HEAVY_UPGRADE |
    OPERATION_HARVEST |
    OPERATION_REMOTE_HARVEST_SCOUT |
    OPERATION_REMOTE_HARVEST |
    OPERATION_ENERGY_TRANSPORT |
    OPERATION_EXTRACTION |
    OPERATION_EXTENSION_FILL |
    OPERATION_STORAGE_CONSTRUCTION |
    OPERATION_TOWER_CONSTRUCTION |
    OPERATION_HARVEST_INFRASTRUCTURE |
    OPERATION_EXTENSION_CONSTRUCTION |
    OPERATION_CONTROLLER_INFRASTRUCTURE |
    OPERATION_HARVEST_LINK_CONSTRUCTION |
    OPERATION_UPGRADE_LINK_CONSTRUCTION |
    OPERATION_EXTENSION_LINK_CONSTRUCTION |
    OPERATION_ROOM_DEFENSE |
    OPERATION_LAB_CONSTRUCTION |
    OPERATION_EXTRACTOR_CONSTRUCTION |
    OPERATION_TERMINAL_CONSTRUCTION |
    OPERATION_OBSERVER_CONSTRUCTION |
    OPERATION_STORAGE_LINK_CONSTRUCTION |
    OPERATION_WALL_CONSTRUCTION |
    OPERATION_ROAD_CONSTRUCTION |
    OPERATION_SPAWN_CONSTRUCTION |
    OPERATION_REPLACE_ORIGINAL_SPAWN |
    OPERATION_ROOM_SCOUT |
    OPERATION_NEW_SPAWN_CONSTRUCTION |
    OPERATION_RESERVATION;

type ProgressType =
    PROGRESS_STANDARD;

type PlanType =
    PLAN_INFRASTRUCTURE |
    PLAN_ECONOMY |
    PLAN_REMOTE_MINING |
    PLAN_ROAD |
    PLAN_DEFENSE;

type CreepControllerType =
    CREEP_CONTROLLER_HARVESTER |
    CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER |
    CREEP_CONTROLLER_LIGHT_UPGRADER |
    CREEP_CONTROLLER_BUILDER |
    CREEP_CONTROLLER_HAULER |
    CREEP_CONTROLLER_UPGRADER |
    CREEP_CONTROLLER_REMOTE_HAULER |
    CREEP_CONTROLLER_REMOTE_HARVESTER |
    CREEP_CONTROLLER_EXTRACTOR |
    CREEP_CONTROLLER_FILLER |
    CREEP_CONTROLLER_CHEMIST |
    CREEP_CONTROLLER_MASON |
    CREEP_CONTROLLER_REPAIR |
    CREEP_CONTROLLER_DEFENDER |
    CREEP_CONTROLLER_CLAIM |
    CREEP_CONTROLLER_SCOUT |
    CREEP_CONTROLLER_RESERVE |
    CREEP_CONTROLLER_WARRIOR;

type BodyType =
    BODY_LIGHT_WORKER |
    BODY_HEAVY_HARVESTER |
    BODY_HEAVY_UPGRADER |
    BODY_HAULER |
    BODY_WARRIOR |
    BODY_SCOUT |
    BODY_DEFENDER |
    BODY_CLAIMER |
    BODY_RANGER |
    BODY_HEALER |
    BODY_HOPLITE |
    BODY_SHIELD;

type MonitorType =
    MONITOR_COLONY_DEFENSE;

type UnitMemberType =
    UNIT_MEMBER_HOPLITE |
    UNIT_MEMBER_RANGER |
    UNIT_MEMBER_HEALER |
    UNIT_MEMBER_SHIELD |
    UNIT_MEMBER_WARRIOR;

type FormationType =
    FORMATION_STANDARD;

type TargetingTacticsType =
    TARGETING_TACTICS_STANDARD;

