import { Layer } from "./Layer";

/**
 * All maps are 50x50
 */
export class Map {
    constructor(terrain: Layer<Terrain>, roads: Layer<boolean>, structures: Layer<StructureConstant>, ramparts: Layer<boolean>) {
        this.terrain = terrain;
        this.roads = roads;
        this.structures = structures;
        this.ramparts = ramparts;
    }

    public terrain: Layer<Terrain>;
    public roads: Layer<boolean>;    
    public structures: Layer<StructureConstant>;
    public ramparts: Layer<boolean>;

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
}
