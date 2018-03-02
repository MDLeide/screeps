import { Colony } from "../../lib/colony/Colony";
import { ColonyProgress, Milestone } from "../../lib/colony/ColonyProgress";

export class StandardProgress {
    public static getMilestones(): Milestone[] {
        return [
            new Milestone(
                "spawn",
                "Spawn Exists",
                (colony: Colony) => { // at least one spawn exists                    
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
                (colony: Colony) => {
                    if (colony.resourceManager.sourceBId)
                        return !_.isUndefined(colony.resourceManager.sourceAContainerOrLinkId) && !_.isUndefined(colony.resourceManager.sourceBContainerOrLinkId);
                    else
                        return !_.isUndefined(colony.resourceManager.sourceAContainerOrLinkId);
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
                (colony: Colony) => {
                    return colony.nest.room.find<StructureExtension>(FIND_MY_STRUCTURES, { filter: (s) => { return s.structureType == STRUCTURE_EXTENSION } }).length >= 5;
                }),
            new Milestone(
                "upgradeContainer",
                "Room has an upgrade container",
                (colony: Colony) => {
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
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 3;
                }),
            new Milestone(
                "firstTower",
                "Room has its first tower built",
                (colony: Colony) => {
                    return colony.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_TOWER;
                        }
                    }).length >= 1;
                }),
            new Milestone(
                "rcl4",
                "Room has reached RCL 4",
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 4;
                }),
            new Milestone(
                "storage",
                "Room has storage built",
                (colony: Colony) => {
                    return colony.nest.room.storage != undefined && colony.nest.room.storage != null;
                }),
            new Milestone(
                "rcl5",
                "Room has reached RCL 5",
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 5;
                }),
            new Milestone(
                "secondTower",
                "Room has built a second tower",
                (colony: Colony) => {
                    return colony.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_TOWER;
                        }
                    }).length >= 2;
                }),
            new Milestone(
                "firstLinks",
                "Room has its first set of links",
                (colony: Colony) => {
                    return colony.resourceManager.sourceAContainerOrLink instanceof StructureLink && colony.resourceManager.controllerLink instanceof StructureLink;
                }),
            new Milestone(
                "rcl6",
                "Room has reach RCL 6",
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 6;
                }),
            new Milestone(
                "thirdLink",
                "Room has third link built",
                (colony: Colony) => {
                    return !_.isUndefined(colony.resourceManager.sourceBId) && colony.resourceManager.sourceBContainerOrLink instanceof StructureLink;
                }),
            new Milestone(
                "extractor",
                "Room has extractor built",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_EXTRACTOR }).length > 0;
                }),
            new Milestone(
                "terminal",
                "Room has a terminal built",
                (colony: Colony) => {
                    return !_.isUndefined(colony.nest.room.terminal);
                }),
            new Milestone(
                "firstLabs",
                "Room has its first three labs built",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_LAB }).length >= 3;
                }),
            new Milestone(
                "rcl7",
                "Room has reached RCL 7",
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 7;
                }),
            new Milestone(
                "thirdTower",
                "Room has its third tower built",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_TOWER }).length >= 3;
                }),
            new Milestone(
                "extensionLink",
                "Room has its fourth link (extension link) built",
                (colony: Colony) => {
                    return !_.isUndefined(colony.resourceManager.extensionLink);
                }),
            new Milestone(
                "sixthLab",
                "Room has six labs built",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_LAB }).length >= 6;
                }),
            new Milestone(
                "rcl8",
                "Room has reached RCL 8",
                (colony: Colony) => {
                    return colony.nest.room.controller.level >= 8;
                }),
            new Milestone(
                "sixthTower",
                "Room has six towers built",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_TOWER }).length >= 6;
                }),
            new Milestone(
                "observer",
                "Room has an observer",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_OBSERVER }).length >= 1;
                }),
            new Milestone(
                "storageLink",
                "Room has its fifth link (storage link) built",
                (colony: Colony) => {
                    return !_.isUndefined(colony.resourceManager.storageLink);
                }),
            new Milestone(
                "labs",
                "Room has ten labs",
                (colony: Colony) => {
                    return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_LAB }).length >= 10;
                }),
        ];
    }

}
