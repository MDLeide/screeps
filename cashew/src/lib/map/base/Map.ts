import { Guid } from "../../../util/GUID";
import { Layer } from "./Layer";

/**
 * All maps are 50x50
 */
export class Map {
    private _terrain: Layer<Terrain>;
    private _roads: Layer<boolean>;
    private _structures: Layer<StructureConstant>;
    private _ramparts: Layer<boolean>;
    private _special: Layer<number>;


    constructor(terrain: Layer<Terrain>, roads: Layer<boolean>, structures: Layer<StructureConstant>, ramparts: Layer<boolean>, special: Layer<number>) {
        this.state = {
            id: Guid.newGuid(),
            height: 50,
            width: 50,
            terrain: terrain.state,
            roads: roads.state,
            structures: structures.state,
            ramparts: ramparts.state,
            special: special.state
        }

        this._terrain = terrain;
        this._roads = roads;
        this._structures = structures;
        this._ramparts = ramparts;
        this._special = special;
    }


    public state: MapMemory;

    public get terrain(): Layer<Terrain> {
        if (!this._terrain) {
            this._terrain = Object.create(Layer.prototype);
            this._terrain.state = this.state.terrain;
        }
        return this._terrain;
    }
    public get roads(): Layer<boolean> {
        if (!this._roads) {
            this._roads = Object.create(Layer.prototype);
            this._roads.state = this.state.roads;
        }
        return this._roads;
    }
    public get structures(): Layer<StructureConstant> {
        if (!this._structures) {
            this._structures = Object.create(Layer.prototype);
            this._structures.state = this.state.structures;            
        }
        return this._structures;
    }
    public get ramparts(): Layer<boolean> {
        if (!this._ramparts) {
            this._ramparts = Object.create(Layer.prototype);
            this._ramparts.state = this.state.ramparts;
        }
        return this._ramparts
    }
    public get special(): Layer<number> {
        if (!this._special) {
            this._special = Object.create(Layer.prototype);
            this._special.state = this.state.special;
        }
        return this._special;
    }

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
