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
                    var containerCount = colony.nest.room.find<StructureContainer>(
                        FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER;
                            }
                        }).length;

                    return containerCount >= colony.nest.room.find(FIND_SOURCES).length;
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
                    return colony.nest.room.find<StructureLink>(FIND_MY_STRUCTURES, {
                        filter: (struct) => {
                            return struct.structureType == STRUCTURE_LINK;
                        }
                    }).length >= 2;
                })
        ];
    }

}
