import { HarvestInfrastructureOperation } from "../operations/economy/HarvestInfrastructureOperation";
import { HarvestOperation } from "../operations/economy/HarvestOperation";
import { LightUpgradeOperation } from "../operations/economy/LightUpgradeOperation";
import { ExtensionsRcl2Operation } from "../operations/economy/ExtensionsRcl2Operation";

import { Colony } from "../../../lib/colony/Colony";
import { ColonyPlan } from "../../../lib/colony/ColonyPlan";
import { ColonyOperation } from "../../../lib/colony/ColonyOperation";
import { Milestone } from "../../../lib/colony/Milestone";
import { HarvestBlock } from "../../../lib/map/blocks/HarvestBlock";
import { ColonyOperationRepository } from "../../../lib/colony/repo/ColonyOperationRepository";

export class StandardPlan extends ColonyPlan {
    private static _colonyOperationRepo: ColonyOperationRepository;

    constructor() {
        super(
            "standardPlan",
            "The standard economic plan used in most rooms.",
            StandardPlan.getMilestones(),
            StandardPlan.getOperations
        );
    }

    private static get colonyOperationRepository(): ColonyOperationRepository {
        if (!this._colonyOperationRepo)
            this._colonyOperationRepo = new ColonyOperationRepository();
        return this._colonyOperationRepo;
    }

    private static getMilestones(): Milestone[] {
        return [
            new Milestone(
                "spawn",
                "Spawn Exists",
                (colony) => { // at least one spawn exists
                    return colony.nest.room.find<StructureSpawn>(
                        FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_SPAWN;
                            }
                        }).length > 0;
                }),
            new Milestone(
                "harvestContainers",
                "Harvest containers have been built",
                (colony) => {
                    var containerCount = colony.nest.room.find<StructureContainer>(
                        FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER;
                            }
                        }).length;

                    return containerCount >= colony.nest.room.nut.seed.findSources().length;
                }),
            new Milestone(
                "rcl2",
                "Room has reached RCL 2",
                (colony) => {
                    return colony.nest.room.controller.level >= 2;
                }),
            new Milestone(
                "fiveExtensions",
                "Room has five extensions built",
                (colony) => {
                    return colony.nest.room.find<StructureExtension>(FIND_MY_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_EXTENSION } }).length >= 5;
                }),
            new Milestone(
                "upgradeContainer",
                "Room has an upgrade container",
                (colony) => {
                    return colony.nest.room.find<StructureContainer>(
                        FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER;
                            }
                        }).length >= 3;
                }),
            new Milestone(
                "rcl3",
                "Room has reached RCL 3",
                (colony) => {
                    return colony.nest.room.controller.level >= 3;
                }),
            new Milestone(
                "firstTower",
                "Room has its first tower built",
                (colony) => {
                    return colony.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_TOWER;
                        }
                    }).length >= 1;
                }),
            new Milestone(
                "rcl4",
                "Room has reached RCL 4",
                (colony) => {
                    return colony.nest.room.controller.level >= 4;
                }),
            new Milestone(
                "storage",
                "Room has storage built",
                (colony) => {
                    return colony.nest.room.storage != undefined && colony.nest.room.storage != null;
                }),
            new Milestone(
                "rcl5",
                "Room has reached RCL 5",
                (colony) => {
                    return colony.nest.room.controller.level >= 5;
                }),
            new Milestone(
                "secondTower",
                "Room has built a second tower",
                (colony) => {
                    return colony.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_TOWER;
                        }
                    }).length >= 2;
                }),
            new Milestone(
                "firstLinks",
                "Room has its first set of links",
                (colony) => {
                    return colony.nest.room.find<StructureLink>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_LINK;
                        }
                    }).length >= 2;
                })
        ];
    }

    private static getOperations(colony: Colony, milestone: Milestone): ColonyOperation[] {
        switch (milestone.id) {
            case "spawn":
                return StandardPlan.spawnOperations(colony);
            case "harvestContainers":
                return StandardPlan.harvestContainersOperations(colony);
            case "rcl2":
                return StandardPlan.rcl2Operations(colony);
            case "fiveExtensions":
                return StandardPlan.fiveExtensionsOperations(colony);
            case "upgradeContainer":
                return StandardPlan.upgradeContainerOperations(colony);
            case "rcl3":
                return StandardPlan.rcl3Operations(colony);
            case "firstTower":
                return StandardPlan.firstTowerOperations(colony);
            case "rcl4":
                return StandardPlan.rcl4Operations(colony);
            case "storage":
                return StandardPlan.storageOperations(colony);
            case "rcl5":
                return StandardPlan.rcl5Operations(colony);
            case "secondTower":
                return StandardPlan.secondTowerOperations(colony);
            case "firstLinks":
                return StandardPlan.firstLinksOperations(colony);
            default:
                throw Error(`argument out of range: ${milestone.id}`);
        }
    }

    private static spawnOperations(colony: Colony): ColonyOperation[] {
        //global.logger.log("Getting operations for Spawn milestone", "yellow", "Standard Plan");
        var ops: ColonyOperation[] = [];
        var sources = colony.nest.room.nut.seed.findSources();
        for (var i = 0; i < sources.length; i++) {
            var op = new HarvestInfrastructureOperation(sources[i]);
            StandardPlan.colonyOperationRepository.add(op);
            ops.push(op);
        }
        return ops;
    }

    public static harvestContainersOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];
        var sources = colony.nest.room.nut.seed.findSources();
        for (var i = 0; i < sources.length; i++) {
            var op = new HarvestOperation(300);
            StandardPlan.colonyOperationRepository.add(op);
            ops.push(op);
        }
        ops.push(new LightUpgradeOperation());
        return ops;
    }

    public static rcl2Operations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];
        var ext = new ExtensionsRcl2Operation()
        var upg = new LightUpgradeOperation()
        StandardPlan.colonyOperationRepository.add(ext);
        StandardPlan.colonyOperationRepository.add(upg);
        ops.push(ext);
        ops.push(upg);
        return ops;
    }

    public static fiveExtensionsOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static upgradeContainerOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static rcl3Operations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static firstTowerOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static rcl4Operations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static storageOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static rcl5Operations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static secondTowerOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }

    public static firstLinksOperations(colony: Colony): ColonyOperation[] {
        var ops: ColonyOperation[] = [];

        return ops;
    }
}
