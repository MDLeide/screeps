import { Colony } from "./Colony";

export class EffectiveRcl {
    constructor(major: number, minor: number, description?: string, verboseDescription?: string) {
        this.major = major;
        this.minor = minor;
        if (description)
            this.description = description;
        if (verboseDescription)
            this.verboseDescription = verboseDescription;
        else if (description)
            this.verboseDescription = description;
    }

    public major: number = 0;
    public minor: number = 0;
    public description: string = "";
    public verboseDescription: string = "";

    public isGreaterThan(major: number, minor: number): boolean {
        return this.major > major || (this.major == major && this.minor > minor);
    }

    public isGreaterThanOrEqualTo(major: number, minor: number): boolean {
        return this.major > major || (this.major == major && this.minor >= minor);
    }

    public isLessThan(major: number, minor: number): boolean {
        return this.major < major || (this.major == major && this.minor < minor);
    }

    public isLessThanOrEqualTo(major: number, minor: number): boolean {
        return this.major < major || (this.major == major && this.minor <= minor);
    }

    public isEqualTo(major: number, minor: number): boolean {
        return this.major == major && this.minor == minor;
    }
}

/** Provides methods of measuring a room's progress. */
export class EffectiveRclCaclulator {
    public static evaluate(colony: Colony): EffectiveRcl {
        let spawnCount = this.countStructures(colony, STRUCTURE_SPAWN);
        if (spawnCount < 1)
            return new EffectiveRcl(1, 0, "Brand new room.");

        if (!colony.resourceManager.structures.sourceAContainer)
            return new EffectiveRcl(1, 1, "Spawn exists.");

        if (colony.resourceManager.sourceBId && !colony.resourceManager.structures.sourceBContainer)
            return new EffectiveRcl(1, 2, "First harvest container built.");

        if (colony.nest.room.controller.level < 2)
            return new EffectiveRcl(1, 3, "Harvest containers built.");


        let extCount = this.countStructures(colony, STRUCTURE_EXTENSION);
        if (extCount < 5)
            return new EffectiveRcl(2, 0, "Base level 2");

        if (!colony.resourceManager.structures.controllerContainer)
            return new EffectiveRcl(2, 1, "5 extensions built.");

        if (colony.nest.room.controller.level < 3)
            return new EffectiveRcl(2, 2, "Controller container built.");


        let towerCount = this.countStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 1)
            return new EffectiveRcl(3, 0, "Base level 3.");

        if (extCount < 10)
            return new EffectiveRcl(3, 1, "First tower built.");

        if (colony.nest.room.controller.level < 4)
            return new EffectiveRcl(3, 2, "10 extensions built.");


        if (!colony.nest.room.storage)
            return new EffectiveRcl(4, 0, "Base level 4.");

        if (extCount < 20)
            return new EffectiveRcl(4, 1, "Storage built.");

        if (colony.nest.room.controller.level < 5)
            return new EffectiveRcl(4, 2, "20 extensions built.");


        if (towerCount < 2)
            return new EffectiveRcl(5, 0, "Base level 5.");

        if (!colony.resourceManager.structures.sourceALink)
            return new EffectiveRcl(5, 1, "Second tower built.");

        if (!colony.resourceManager.structures.controllerLink)
            return new EffectiveRcl(5, 2, "First source link built.");

        if (extCount < 30)
            return new EffectiveRcl(5, 3, "Controller link built.");

        if (colony.nest.room.controller.level < 6)
            return new EffectiveRcl(5, 4, "30 extensions built.");


        if (extCount < 40)
            return new EffectiveRcl(6, 0, "Base level 6.");

        if (!colony.resourceManager.structures.extensionLink)
            return new EffectiveRcl(6, 1, "40 extensions built.");

        let extractorCount = this.countStructures(colony, STRUCTURE_EXTRACTOR);
        if (extractorCount < 1)
            return new EffectiveRcl(6, 2, "Extension link built.");

        if (!colony.nest.room.terminal)
            return new EffectiveRcl(6, 3, "Extractor built.");

        let labCount = this.countStructures(colony, STRUCTURE_LAB);
        if (labCount < 3)
            return new EffectiveRcl(6, 4, "Terminal built.");

        if (colony.nest.room.controller.level < 7)
            return new EffectiveRcl(6, 5, "3 labs built.");


        if (spawnCount < 2)
            return new EffectiveRcl(7, 0, "Base level 7.");

        if (towerCount < 3)
            return new EffectiveRcl(7, 1, "Second spawn built.");

        if (extCount < 50)
            return new EffectiveRcl(7, 2, "Third tower built.");

        if (colony.resourceManager.sourceBId && !colony.resourceManager.structures.sourceBLink)
            return new EffectiveRcl(7, 3, "50 extensions built.");

        if (labCount < 6)
            return new EffectiveRcl(7, 4, "Second source link built.");

        if (colony.nest.room.controller.level < 8)
            return new EffectiveRcl(7, 5, "6 labs built.");


        if (spawnCount < 3)
            return new EffectiveRcl(8, 0, "Base level 8.");

        if (towerCount < 6)
            return new EffectiveRcl(8, 1, "Third spawn built.");

        if (extCount < 60)
            return new EffectiveRcl(8, 2, "6 towers built.");

        if (!colony.resourceManager.structures.storageLink)
            return new EffectiveRcl(8, 3, "60 extensions built.");

        let observerCount = this.countStructures(colony, STRUCTURE_OBSERVER);
        if (observerCount < 1)
            return new EffectiveRcl(8, 4, "Storage link built.");

        if (labCount < 10)
            return new EffectiveRcl(8, 5, "Observer built.");

        return new EffectiveRcl(8, 6, "Room complete.");
    }

    private static countStructures(colony: Colony, structure: StructureConstant): number {
        return colony.nest.room.find(FIND_STRUCTURES, { filter: (p) => p.structureType == structure }).length;
    }
}


