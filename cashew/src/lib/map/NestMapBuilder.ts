import { NestMap } from "./NestMap";
import { IBlockProvider } from "./IBlockProvider";

import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";
import { Layer } from "./base/Layer";

import { HarvestBlock } from "./blocks/HarvestBlock";
import { ExtensionBlock } from "./blocks/ExtensionBlock";
import { MainBlock } from "./blocks/MainBlock";
import { ControllerBlock } from "./blocks/ControllerBlock";
import { LabBlock } from "./blocks/LabBlock";


export class NestMapBuilder {
    constructor(
        private harvestProvider: IBlockProvider<HarvestBlock>,
        private extensionProvider: IBlockProvider<ExtensionBlock>,
        private mainProvider: IBlockProvider<MainBlock>,
        private controllerProvider: IBlockProvider<ControllerBlock>,
        private labProvider: IBlockProvider<LabBlock>) {
    }

    public getMap(room: Room): NestMap {
        var map = new NestMap();
        map.map = this.makeBaseMap(room);

        map.controllerBlock = this.getControllerBlock(room, map.map);
        this.addMapBlock(map.map, map.controllerBlock);

        map.harvestBlocks = this.getHarvestBlocks(room, map.map);
        for (var i = 0; i < map.harvestBlocks.length; i++)
            this.addMapBlock(map.map, map.harvestBlocks[i]);

        map.mainBlock = this.getMainBlock(room, map.map);
        this.addMapBlock(map.map, map.mainBlock);

        map.extensionBlock = this.getExtensionBlock(room, map.map);
        this.addMapBlock(map.map, map.extensionBlock);
        
        return map;
    }

    private makeBaseMap(room: Room): Map {
        room.lookAtArea(0, 0, 50, 50, true);
        var map = new Map(
            new Layer<Terrain>(50, 50, "plain"),
            new Layer<boolean>(50, 50, false),
            new Layer<StructureConstant>(50, 50, null),
            new Layer<boolean>(50, 50, false),
            new Layer<number>(50, 50, 0));
        
        var terrain = room.lookForAtArea(LOOK_TERRAIN, 0, 0, 49, 49, true);
        for (var i = 0; i < terrain.length; i++) {
            var t = terrain[i];
            map.terrain.setAt(t.x, t.y, t.terrain);
        }

        return map;
    }

    private addMapBlock(map: Map, mapblock: MapBlock): void {
        for (var x = 0; x < mapblock.width; x++) {
            for (var y = 0; y < mapblock.height; y++) {
                var xD = mapblock.offsetX + x;
                var yD = mapblock.offsetY + y;

                map.ramparts.setAt(xD, yD, mapblock.ramparts.getAt(x, y));
                map.structures.setAt(xD, yD, mapblock.structures.getAt(x, y));
                map.roads.setAt(xD, yD, mapblock.roads.getAt(x, y));
                map.special.setAt(xD, yD, mapblock.special.getAt(x, y));                
            }
        }
    }

    private getControllerBlock(room: Room, map: Map): ControllerBlock {
        console.log("get controller block");

        var block: ControllerBlock = this.controllerProvider.getNext();
        //global.logger.log(`Controller: [${room.controller.pos.x}, ${room.controller.pos.y}]`, "orange");
        while (block) {            
            for (var i = 0; i < 4; i++) {
                //global.logger.log(`  Rotation ${i}`, "orange")

                var controllerLoc = block.getLocalControllerLocation();
                //global.logger.log(`Block Local Controller: [${controllerLoc.x}, ${controllerLoc.y}]`, "orange");

                block.offsetX = room.controller.pos.x - controllerLoc.x;
                block.offsetY = room.controller.pos.y - controllerLoc.y;
                //global.logger.log(`Offset: [${block.offsetX}, ${block.offsetY}]`, "orange");

                var controllerAbs = block.getContainerLocation();                                
                //global.logger.log(`Block Controller: [${controllerAbs.x}, ${controllerAbs.y}]`, "orange");
                

                if (this.controllerBlockFits(block, room.controller, map)) {
                    this.controllerProvider.reset();
                    return block;
                }
                block = this.controllerProvider.rotateClockwise(block);
            }
            block = this.controllerProvider.getNext();
        }
        return null;
    }

    private controllerBlockFits(block: ControllerBlock, controller: StructureController, map: Map) {
        var containerLoc = block.getContainerLocation();
        var standLocs = block.getStandLocations();
        if (!this.isWalkable(map, containerLoc.x, containerLoc.y)) {            
            return false;
        }

        for (var i = 0; i < standLocs.length; i++) {
            if (!this.isWalkable(map, standLocs[i].x, standLocs[i].y)) {                
                return false;
            }
        }
        return true;
    }

    private getMainBlock(room: Room, map: Map): MainBlock {
        console.log("get main block");

        var block: MainBlock = this.mainProvider.getNext();;
        while (block) {
            var w = Math.floor(block.width / 2);
            var h = Math.floor(block.height / 2);

            for (var i = 0; i < 500; i++) {
                var offset = this.ulamSpiral(i);
                block.offsetX = 25 - w + offset.x;
                block.offsetY = 25 - h + offset.y;
                if (this.blockFits(block, map)) {
                    this.mainProvider.reset();
                    return block;
                }
            }            
            block = this.mainProvider.getNext();
        }
        return null;
    }

    private getHarvestBlocks(room: Room, map: Map): HarvestBlock[] {
        console.log("get harvest[s]");
        var blocks = [];
        var sources = room.nut.seed.findSources();
        for (var i = 0; i < sources.length; i++) {
            var b = this.getHarvestBlock(sources[i], map);
            if (b)
                blocks.push(b);
        }
        return blocks;
    }
    
    private getHarvestBlock(source: Source, map: Map): HarvestBlock {
        var block: HarvestBlock = this.harvestProvider.getNext();
        while (block) {            
            for (var i = 0; i < 4; i++) {
                var srcLoc = block.getLocalSourceLocation();
                block.offsetX = source.pos.x - srcLoc.x;
                block.offsetY = source.pos.y - srcLoc.y;

                if (this.harvestBlockFits(block, source, map)) {                    
                    this.harvestProvider.reset();
                    return block;
                }
                block = this.harvestProvider.rotateClockwise(block);
            }
            block = this.harvestProvider.getNext();
        }
        return null;
    }
    
    private getExtensionBlock(room: Room, map: Map): ExtensionBlock {
        var block: ExtensionBlock = this.extensionProvider.getNext();

        while (block) {
            var w = Math.floor(block.width / 2);
            var h = Math.floor(block.height / 2);

            for (var i = 0; i < 500; i++) {
                var offset = this.ulamSpiral(i);
                block.offsetX = 25 - w + offset.x;
                block.offsetY = 25 - h + offset.y;

                if (this.blockFits(block, map)) {
                    this.extensionProvider.reset();
                    return block;
                }
            }
            block = this.extensionProvider.getNext();            
        }
        return null;
    }

    private harvestBlockFits(block: HarvestBlock, source: Source, map: Map): boolean {        
        var s = block.getSourceLocation();
        var c = block.getContainerLocation();
        var terrain = map.terrain.getAt(c.x, c.y);        
        if (terrain == "wall")
            return false;

        var struct = map.structures.getAt(c.x, c.y);
        return struct == null;
    }
        
    private blockFits(block: MapBlock, map: Map): boolean {        
        for (var x = 0; x < block.width; x++) {
            for (var y = 0; y < block.height; y++) {
                if (this.needsWalkable(x, y, block)) {
                    if (!this.isWalkable(map, x + block.offsetX, y + block.offsetY))
                        return false;
                }
            }
        }
        return true;

    }

    private isWalkable(map: Map, x: number, y: number) : boolean {
        var terrain = map.terrain.getAt(x, y);
        if (terrain == "wall") {            
            return false;
        }
            
        var struct = map.structures.getAt(x, y);
        if (struct != null) {            
            return false;
        }
        return true;
    }

    private needsWalkable(x: number, y: number, block: MapBlock): boolean{
        if (block.getRoadAt(x, y))
            return true;
        if (block.getStructureAt(x, y) != null)
            return true;
        return false;
    }

    private ulamSpiral(n): { x: number, y: number, sq: number } {
        // Note - The spiral paths counter-clockwise: (0,0) (0,1) (-1,1) (-1,0) ...
        let p = Math.floor(Math.sqrt(4 * n + 1));
        let q = n - Math.floor(p * p / 4);
        let sq = Math.floor((p + 2) / 4);
        let x = 0;
        let y = 0;
        if (p % 4 === 0) {
            // Bottom Segment
            x = -sq + q;
            y = -sq;
        } else if (p % 4 === 1) {
            // Right Segment
            x = sq;
            y = -sq + q;
        } else if (p % 4 === 2) {
            // Top Segment
            x = sq - q - 1;
            y = sq;
        } else if (p % 4 === 3) {
            // Left Segment
            x = -sq;
            y = sq - q;
        }

        return { x: x, y: y, sq: sq };
    };
}
