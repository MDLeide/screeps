import { MapBlock } from "../base/MapBlock";
/**
Provides a description of the extension block. USes the special layer to indicate the RCL that
particular extensions should be built at.
 */

export class ExtensionBlock extends MapBlock {
    constructor(
        height: number,
        width: number,
        linkX: number,
        linkY: number,
        extensions: { x: number, y: number }[],
        rcl: { level: number, locations: { x: number, y: number }[] }[],
        roads: { x: number, y: number }[]) {

        super(height, width, 0, 0);
        this.structures.setAt(linkX, linkY, STRUCTURE_LINK);
        for (var i = 0; i < extensions.length; i++)
            this.structures.setAt(extensions[i].x, extensions[i].y, STRUCTURE_EXTENSION);

        for (var i = 0; i < roads.length; i++)
            this.roads.setAt(roads[i].x, roads[i].y, true);

        for (var i = 0; i < rcl.length; i++)
            for (var j = 0; j < rcl[i].locations.length; j++)
                this.special.setAt(rcl[i].locations[j].x, rcl[i].locations[j].y, rcl[i].level);
    }

    public getExtensionLocations(rcl: number): { x: number, y: number }[] {
        var results = [];

        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                if (this.special.getAt(x, y) == rcl)
                    results.push({ x: x, y: y });

        return results;
    }

}
