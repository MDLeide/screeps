import { Layer } from "../base/Layer";
import { MapBlock } from "../base/MapBlock";
/**
Provides a description of the extension block. USes the special layer to indicate the RCL that
particular extensions should be built at.
 */

export class ExtensionBlock extends MapBlock {
    public static fromMemory(memory: MapBlockMemory): ExtensionBlock {
        var block = Object.create(ExtensionBlock.prototype) as ExtensionBlock;
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
        linkX: number,
        linkY: number,
        extensions: { x: number, y: number }[],
        indicies: { x: number, y: number }[],
        pathA: { x: number, y: number }[],
        pathB: { x: number, y: number }[],
        roads: { x: number, y: number }[]) {

        super(height, width, { x: 0, y: 0 });
        this.structures.setAt(linkX, linkY, STRUCTURE_LINK);
        for (var i = 0; i < extensions.length; i++)
            this.structures.setAt(extensions[i].x, extensions[i].y, STRUCTURE_EXTENSION);

        for (var i = 0; i < roads.length; i++)
            this.roads.setAt(roads[i].x, roads[i].y, true);

        for (var i = 0; i < indicies.length; i++)
            this.special.setAt(indicies[i].x, indicies[i].y, i + 1);

        for (var i = 0; i < pathA.length; i++)
            this.special.setAt(pathA[i].x, pathA[i].y, i + 101);

        for (var i = 0; i < pathB.length; i++)
            this.special.setAt(pathB[i].x, pathB[i].y, i + 201);
    }

    public getStandALocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.getSpecialAt(x, y) == 101)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getStandBLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.getSpecialAt(x, y) == 201)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getFillOrder(): { x: number, y: number }[] {        
        let results: {
            index: number, location: { x: number, y: number }
        }[] = [];

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                let spec = this.special.getAt(x, y);
                if (spec < 100 && spec > 0) 
                    results.push({ index: spec, location: { x: x + this.offset.x, y: y + this.offset.y } });
            }
        }
        
        results = _.sortBy(results, p => p.index);
        let final = []
        for (var i = 0; i < results.length; i++)
            final.push(results[i].location);        
        return final;
    }

    public getMoveDirections(rcl: number, sideA: boolean): { x: number, y: number }[] {
        if (rcl <= 1)
            return null;

        let min: number = sideA ? 100 : 200;
        let max: number = CONTROLLER_STRUCTURES[rcl];
        let results: {
            index: number, location: { x: number, y: number }
        }[];

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                let spec = this.special.getAt(x, y);
                if (spec >= min && spec < max)
                    results.push({ index: spec, location: { x: x + this.offset.x, y: y + this.offset.y } });
            }
        }

        _.sortBy(results, p => p.index);
        let final = []
        for (var i = 0; i < results.length; i++)
            final.push(results.length[i].location);
        return final;
    }

    public getExtensionLocations(rcl: number): { x: number, y: number }[] {        
        if (rcl <= 1)
            return null;

        let min: number = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl - 1];
        let max: number = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl];
        let results = [];

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                let spec = this.special.getAt(x, y);
                if (spec > min && spec <= max)
                    results.push({ x: x + this.offset.x, y: y + this.offset.y });
            }
        }

        return results;
    }

    public getLinkLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                if (this.structures.getAt(x, y) == STRUCTURE_LINK)
                    return { x: x + this.offset.x, y: y + this.offset.y };
        return null;
    }

}
