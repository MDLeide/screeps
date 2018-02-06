import { SpawnSeed } from '../Seed/SpawnSeed';
import { StatefulNut } from '../../../lib/extend/StatefulNut';
import { Population } from "../../../lib/spawn/Population";

export class SpawnNut extends StatefulNut<StructureSpawn, SpawnSeed, SpawnMemory>{
    private _population: Population;

    constructor(seed: SpawnSeed, state: SpawnMemory) {
        super(seed, state);
    }

    public get population() {
        if (!this._population) {
            this._population = new Population(this.spawn);
        }
        return this._population;
    }

    public get spawn(): StructureSpawn {
        return this.seed.spawn;
    }

    /**
     * Gets a list of targets for filling with energy.
     */
    public getEnergyTargets(): (StructureSpawn | StructureExtension)[] {
        let targets: (StructureSpawn | StructureExtension)[] = [];
        let spawn = this.spawn;
        if (spawn.energy < spawn.energyCapacity) {
            targets.push(spawn);
        }

        var extensions =
            spawn.room.find<StructureExtension>(
                FIND_MY_STRUCTURES,
                {
                    filter: function (ext: StructureExtension) {
                        return ext.structureType === STRUCTURE_EXTENSION && spawn.nut.isValidEnergyTarget(ext);
                    }
                });

        if (extensions) {
            if (extensions.length > 0) {
                for (var i = 0; i < extensions.length; i++) {
                    targets.push(extensions[i]);
                }
            }
        }

        return targets;
    }

    public getExtensions(): StructureExtension[] {
        return this.spawn.room.find<StructureExtension>(
            FIND_MY_STRUCTURES,
            {
                filter: function (ext: StructureExtension) {
                    return ext.structureType === STRUCTURE_EXTENSION;
                }
            });
    }

    public isValidEnergyTarget(extension: StructureExtension): boolean {
        //todo: register with the extensions
        return extension.energy < extension.energyCapacity;
    };

    public totalEnergyAvailable(): number {
        var energy = this.spawn.energy;
        var extensions = this.getExtensions();
        for (var i = 0; i < extensions.length; i++) {
            energy += extensions[i].energy;
        }
        return energy;
    }
}
