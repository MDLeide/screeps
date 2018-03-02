import { MapBlock } from "../base/MapBlock";
import { Layer } from "../base/Layer";

export class MainBlock extends MapBlock {
    public static fromMemory(memory: MapBlockMemory): MainBlock {
        var block = Object.create(MainBlock.prototype) as MainBlock;
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
        spawns: { x: number, y: number }[],
        towers: { x: number, y: number }[],
        storage: { x: number, y: number },
        terminal: { x: number, y: number },
        rcl: { level: number, locations: { x: number, y: number }[] }[],
        roads: { x: number, y: number }[]) {
        super(height, width, { x: 0, y: 0 });
                
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

    public getSpawnLocatoion(rcl: number): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == rcl)
                    if (this.structures.getAt(x, y) == STRUCTURE_SPAWN)
                        return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getTowerLocation(rcl: number): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == rcl)
                    if (this.structures.getAt(x, y) == STRUCTURE_TOWER)
                        return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getTerminalLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                if (this.structures.getAt(x, y) == STRUCTURE_TERMINAL)
                    return { x: x + this.offset.x, y: y + this.offset.y };
        return null;
    }

    public getStorageLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++)
            for (var y = 0; y < this.height; y++)
                if (this.structures.getAt(x, y) == STRUCTURE_STORAGE)
                    return { x: x + this.offset.x, y: y + this.offset.y };
        return null;
    }
}
