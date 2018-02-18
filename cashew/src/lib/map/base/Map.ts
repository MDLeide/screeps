import { Guid } from "../../../util/GUID";
import { Layer } from "./Layer";

/**
 * All maps are 50x50
 */
export class Map {
    public static fromMemory(memory: MapMemory) : Map {
        return new this(
            Layer.fromMemory(memory.terrain),
            Layer.fromMemory(memory.roads),
            Layer.fromMemory(memory.structures),
            Layer.fromMemory(memory.ramparts),
            Layer.fromMemory(memory.special)
        );
    }

    constructor(
        terrain: Layer<Terrain>,
        roads: Layer<boolean>,
        structures: Layer<StructureConstant>,
        ramparts: Layer<boolean>,
        special: Layer<number>) {

        this.terrain = terrain;
        this.roads = roads;
        this.structures = structures;
        this.ramparts = ramparts;
        this.special = special;
    }


    public terrain: Layer<Terrain>;
    public roads: Layer<boolean> ;
    public structures: Layer<StructureConstant>;
    public ramparts: Layer<boolean>;
    public special: Layer<number>;

    public getRoadAt(x: number, y: number): boolean {
        return this.roads.getAt(x, y);
    }

    public getTerrainAt(x: number, y: number): Terrain {
        return this.terrain.getAt(x, y);
    }

    public getStructureAt(x: number, y: number): StructureConstant {
        return this.structures.getAt(x, y);
    }

    public getRampartAt(x: number, y: number): boolean {
        return this.ramparts.getAt(x, y);
    }

    public getMoveCostAt(x: number, y: number): number {
        if (this.getRoadAt(x, y))
            return 1;
        var terrain = this.getTerrainAt(x, y);
        switch (terrain) {
            case "plain":
                return 2;
            case "swamp":
                return 10;
            case "wall":
                return -1;
            default:
                throw Error("argument out of range");
        }
    }


    public save(): MapMemory {
        return {
            terrain: this.terrain.save(),
            roads: this.roads.save(),
            structures: this.structures.save(),
            ramparts: this.ramparts.save(),
            special: this.special.save()
        };
    }
}
