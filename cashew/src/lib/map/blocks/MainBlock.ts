import { MapBlock } from "../base/MapBlock";
import { Layer } from "../base/Layer";

export class MainBlock extends MapBlock {
    constructor(
        height: number,
        width: number,        
        spawns: { x: number, y: number }[],
        towers: { x: number, y: number }[],
        storage: { x: number, y: number },
        terminal: { x: number, y: number },
        rcl: { level: number, locations: { x: number, y: number }[] }[],
        roads: { x: number, y: number }[]) {
        super(height, width, 0, 0);
                
        this.set(spawns, this.structures, STRUCTURE_SPAWN);
        this.set(towers, this.structures, STRUCTURE_TOWER);
        this.structures.setAt(storage.x, storage.y, STRUCTURE_STORAGE);
        this.structures.setAt(terminal.x, terminal.y, STRUCTURE_TERMINAL);

        for (var i = 0; i < roads.length; i++)
            this.roads.setAt(roads[i].x, roads[i].y, true);

        for (var i = 0; i < rcl.length; i++)
            for (var j = 0; j < rcl[i].locations.length; j++)
                this.special.setAt(rcl[i].locations[j].x, rcl[i].locations[j].y, rcl[i].level);
    }
    
    private set(locations: { x: number, y: number }[], layer: Layer<StructureConstant>, structureType: StructureConstant) {
        for (var i = 0; i < locations.length; i++)
            layer.setAt(locations[i].x, locations[i].y, structureType);        
    }
    
}
