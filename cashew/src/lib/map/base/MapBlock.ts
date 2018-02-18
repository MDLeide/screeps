import { Layer } from "./Layer";
import { Guid } from "../../../util/GUID";

export class MapBlock {
    public static fromMemory(memory: MapBlockMemory) : MapBlock {
        return new this(
            memory.height,
            memory.width,
            memory.offset,
            Layer.fromMemory(memory.roads),
            Layer.fromMemory(memory.structures),
            Layer.fromMemory(memory.ramparts),
            Layer.fromMemory(memory.special));
    }

    constructor(
        height: number,
        width: number,
        offset: { x: number, y: number },
        roads?: Layer<boolean>,
        structures?: Layer<StructureConstant>,
        ramparts?: Layer<boolean>,
        special?: Layer<number>) {

        this.height = height;
        this.width = width;
        this.offset = offset;

        this.roads = roads ? roads : new Layer<boolean>(height, width, false);
        this.structures = structures ? structures : new Layer<StructureConstant>(height, width, null);
        this.ramparts = ramparts ? ramparts : new Layer<boolean>(height, width, false);
        this.special = special ? special : new Layer<number>(height, width, 0);
    }


    public offset: { x: number, y: number };
    public height: number;
    public width: number;

    public roads: Layer<boolean>;
    public structures: Layer<StructureConstant>;
    public ramparts: Layer<boolean>;
    public special: Layer<number>;
        

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

    public save(): MapBlockMemory {
        return {
            height: this.height,
            width: this.width,
            offset: this.offset,
            roads: this.roads.save(),
            structures: this.structures.save(),
            ramparts: this.ramparts.save(),
            special: this.special.save()
        };
    }
}
