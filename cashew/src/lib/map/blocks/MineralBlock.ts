import { Layer } from "../base/Layer";
import { MapBlock } from "../base/MapBlock";

export class MineralBlock extends MapBlock {
    public static fromMemory(memory: MapBlockMemory): MineralBlock {
        var block = Object.create(MineralBlock.prototype) as MineralBlock;
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
        mineralX: number,
        mineralY: number,
        containerX: number,
        containerY: number,
        roads: { x: number, y: number }[]) {
        super(height, width, { x: 0, y: 0 });

        this.special.setAt(mineralX, mineralY, 1);
        this.structures.setAt(mineralX, mineralY, STRUCTURE_EXTRACTOR);
        this.structures.setAt(containerX, containerY, STRUCTURE_CONTAINER);
        for (var i = 0; i < roads.length; i++)
            this.roads.setAt(roads[i].x, roads[i].y, true);        
    }

    public static readonly MineralToken: number = 1;

    public getLocalContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.structures.getAt(x, y) == STRUCTURE_CONTAINER)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getLocalExtractorLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.structures.getAt(x, y) == STRUCTURE_EXTRACTOR)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getLocalMineralLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == MineralBlock.MineralToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }


    public getContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.structures.getAt(x, y) == STRUCTURE_CONTAINER)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getExtractorLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.structures.getAt(x, y) == STRUCTURE_EXTRACTOR)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getMineralLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == MineralBlock.MineralToken)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }
}
