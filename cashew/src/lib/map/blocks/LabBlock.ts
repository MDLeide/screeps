import { Layer } from "../base/Layer";
import { MapBlock } from "../base/MapBlock";

export class LabBlock extends MapBlock {
    public static fromMemory(memory: MapBlockMemory): LabBlock {
        var block = Object.create(LabBlock.prototype) as LabBlock;
        block.roads = Layer.fromMemory(memory.roads);
        block.structures = Layer.fromMemory(memory.structures);
        block.ramparts = Layer.fromMemory(memory.ramparts);
        block.special = Layer.fromMemory(memory.special);
        block.height = memory.height;
        block.width = memory.width;
        block.offset = { x: memory.offset.x, y: memory.offset.y };
        return block;
    }


    constructor(
        height: number,
        width: number,
        labs: { x: number, y: number }[],
        rcl: { level: number, locations: { x: number, y: number }[] }[],
        roads: { x: number, y: number }[]) {

        super(height, width, { x: 0, y: 0 });        
        for (var i = 0; i < labs.length; i++)
            this.structures.setAt(labs[i].x, labs[i].y, STRUCTURE_LAB);

        for (var i = 0; i < roads.length; i++)
            this.roads.setAt(roads[i].x, roads[i].y, true);

        for (var i = 0; i < rcl.length; i++)
            for (var j = 0; j < rcl[i].locations.length; j++)
                this.special.setAt(rcl[i].locations[j].x, rcl[i].locations[j].y, rcl[i].level);
    }

    public getLabLocations(rcl: number): { x: number, y: number }[] {
        var results = [];

        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                if (this.special.getAt(x, y) == rcl)
                    results.push({ x: x, y: y });

        return results;
    }

}
