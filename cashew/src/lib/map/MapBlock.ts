import { Layer } from "./Layer";
import { Guid } from "../../util/GUID";

export class MapBlock {
    private _roads: Layer<boolean>;
    private _structures: Layer<StructureConstant>;
    private _ramparts: Layer<boolean>;
    private _special: Layer<number>;

    constructor(height: number, width: number, offsetX: number, offsetY: number) {
        this._roads = new Layer<boolean>(height, width, false);
        this._structures = new Layer<StructureConstant>(height, width, null);
        this._ramparts = new Layer<boolean>(height, width, false);
        this._special = new Layer<number>(height, width, 0);

        this.state = {
            id: Guid.newGuid(),
            height: height,
            width: width,
            offsetX: offsetX,
            offsetY: offsetY,
            roads: this._roads.state,
            structures: this._structures.state,
            ramparts: this._ramparts.state,
            special: this._special.state
        };
    }

    public state: MapBlockMemory;

    public get offsetX(): any { return this.state.offsetX; }
    public set offsetX(val: any) { this.state.offsetX = val; }

    public get offsetY(): any { return this.state.offsetY; }
    public set offsetY(val: any) { this.state.offsetY = val; }
    
    public get id(): string { return this.state.id; }
    public set id(val: string) { this.state.id = val; }

    public get height(): number { return this.state.height; }
    public set height(val: number) { this.state.height = val; }

    public get width(): number { return this.state.width; }
    public set width(val: number) { this.state.width = val; }

    public get roads(): Layer<boolean> {
        if (!this._roads)
            this._roads = Layer.LoadFromState<boolean>(this.state.roads);
        return this._roads;
    }
    public get structures(): Layer<StructureConstant> {
        if (!this._structures)
            this._structures = Layer.LoadFromState<StructureConstant>(this.state.structures);
        return this._structures;
    }
    public get ramparts(): Layer<boolean> {
        if (!this._ramparts)
            this._ramparts = Layer.LoadFromState<boolean>(this.state.ramparts);
        return this._ramparts;
    }
    public get special(): Layer<number> {
        if (!this._special)
            this._special = Layer.LoadFromState<number>(this.state.special);
        return this._special;
    }

    public getRoadAt(x: number, y: number): boolean {
        return this.roads.getAt(x, y);
    }
    
    public getStructureAt(x: number, y: number): StructureConstant {
        return this.structures.getAt(x, y);
    }

    public getRampartAt(x: number, y: number): boolean {
        return this.ramparts.getAt(x, y);
    }

    public getSpecialAt(x: number, y: number): number {
        return this.special.getAt(x, y);
    }
}
