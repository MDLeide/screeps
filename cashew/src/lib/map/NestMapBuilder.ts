import { NestMap } from "./NestMap";
import { IBlockProvider } from "./IBlockProvider";

import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";
import { Layer } from "./base/Layer";

import { HarvestBlock } from "./blocks/HarvestBlock";
import { MineralBlock } from "./blocks/MineralBlock";
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
        private labProvider: IBlockProvider<LabBlock>,
        private mineralProvider: IBlockProvider<MineralBlock>) {
    }

    public getMap(room: Room): NestMap {        
        var map = this.makeBaseMap(room);

        let controllerBlock = this.getAndAddBlock(room, map, this.getControllerBlock, "controller block");
        if (!controllerBlock)
            return null;

        let harvestBlocks = this.getAndAddMultiBlocks(room, map, this.getHarvestBlocks, "harvest block");
        if (!harvestBlocks || !harvestBlocks.length)
            return null;
        
        let extensionBlock = this.getAndAddBlock(room, map, this.getExtensionBlock, "extension block");
        if (!extensionBlock)
            return null;

        let mainBlock = this.getAndAddBlock(room, map, this.getMainBlock, "main block");
        if (!mainBlock)
            return null;

        let labBlock = this.getAndAddBlock(room, map, this.getLabBlock, "lab block");
        if (!labBlock)
            return null;

        let mineralBlock = this.getAndAddBlock(room, map, this.getMineralBlock, "mineral block");
        if (!mineralBlock)
            return null;

        return new NestMap(
            map,
            harvestBlocks,
            extensionBlock,
            mainBlock,
            controllerBlock,
            labBlock,
            mineralBlock);
    }


    private getAndAddBlock<TMapBlock extends MapBlock>(room: Room, map: Map, delegate: (room: Room, map: Map) => TMapBlock, blockName: string): TMapBlock {
        let block = delegate(room, map);
        if (!block) {
            global.events.empire.nestMappingFailed(room.name, blockName);
            return null;
        }
        this.addMapBlock(map, block);
        return block;
    }

    private getAndAddMultiBlocks<TMapBlock extends MapBlock>(room: Room, map: Map, delegate: (room: Room, map: Map) => TMapBlock[], blockName: string): TMapBlock[] {
        let blocks = delegate(room, map);
        if (!blocks.length) {
            global.events.empire.nestMappingFailed(room.name, blockName);
            return null;
        }
        for (var i = 0; i < blocks.length; i++)
            this.addMapBlock(map, blocks[i]);
        return blocks;
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
                var xD = mapblock.offset.x + x;
                var yD = mapblock.offset.y + y;

                map.ramparts.setAt(xD, yD, mapblock.ramparts.getAt(x, y));
                map.structures.setAt(xD, yD, mapblock.structures.getAt(x, y));
                map.roads.setAt(xD, yD, mapblock.roads.getAt(x, y));
                map.special.setAt(xD, yD, mapblock.special.getAt(x, y));                
            }
        }
    }


    private getControllerBlock(room: Room, map: Map): ControllerBlock {
        var block: ControllerBlock = this.controllerProvider.getNext();        
        while (block) {            
            for (var i = 0; i < 4; i++) {
                var controllerLoc = block.getLocalControllerLocation();
                block.offset.x = room.controller.pos.x - controllerLoc.x;
                block.offset.y = room.controller.pos.y - controllerLoc.y;                
                if (this.blockFits(block, map)) {
                    this.controllerProvider.reset();
                    return block;
                }
                block = this.controllerProvider.rotateClockwise(block);
            }
            block = this.controllerProvider.getNext();
        }
        return null;
    }
    
    private getLabBlock(room: Room, map: Map): LabBlock {
        var block: LabBlock = this.labProvider.getNext();;
        while (block) {
            var w = Math.floor(block.width / 2);
            var h = Math.floor(block.height / 2);

            for (var i = 0; i < 500; i++) {
                var offset = this.ulamSpiral(i);
                block.offset.x = 25 - w + offset.x;
                block.offset.y = 25 - h + offset.y;
                if (this.blockFits(block, map)) {
                    this.labProvider.reset();
                    return block;
                }
            }
            block = this.labProvider.getNext();
        }
        return null;
    }


    private getMainBlock(room: Room, map: Map): MainBlock {
        let spawn = room.find<StructureSpawn>(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_SPAWN });
        if (spawn.length)
            return this.fitMainBlockToExistingSpawn(map, { x: spawn[0].pos.x, y: spawn[0].pos.y });
        else
            return this.getMainBlockNoSpawn(room, map);
    }

    private getMainBlockNoSpawn(room: Room, map: Map): MainBlock {
        var block: MainBlock = this.mainProvider.getNext();;
        while (block) {
            var w = Math.floor(block.width / 2);
            var h = Math.floor(block.height / 2);

            for (var i = 0; i < 500; i++) {
                var offset = this.ulamSpiral(i);
                block.offset.x = 25 - w + offset.x;
                block.offset.y = 25 - h + offset.y;
                if (this.blockFits(block, map)) {
                    this.mainProvider.reset();
                    return block;
                }
            }
            block = this.mainProvider.getNext();
        }
        return null;
    }

    private fitMainBlockToExistingSpawn(map: Map, spawnLocation: { x: number, y: number }): MainBlock {
        let block = this.mainProvider.getNext();
        while (block) {
            for (var j = 0; j < 4; j++) {
                for (var i = 1; i < 9; i++) {
                    let localSpawn = block.getLocalSpawnLocation(i);
                    if (localSpawn) {
                        block.offset.x = spawnLocation.x - localSpawn.x;
                        block.offset.y = spawnLocation.y - localSpawn.y;
                        if (this.blockFits(block, map)) {
                            this.mainProvider.reset();
                            return block;
                        }
                    }
                }
                block = this.mainProvider.rotateClockwise(block);
            }
            block = this.mainProvider.getNext();
        }
        return null;
    }


    private getHarvestBlocks(room: Room, map: Map): HarvestBlock[] {        
        var blocks = [];
        
        var sources = room.find(FIND_SOURCES);
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
                block.offset.x = source.pos.x - srcLoc.x;
                block.offset.y = source.pos.y - srcLoc.y;
                if (this.blockFits(block, map)){                
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
                block.offset.x = 25 - w + offset.x;
                block.offset.y = 25 - h + offset.y;

                if (this.blockFits(block, map)) {
                    this.extensionProvider.reset();
                    return block;
                }
            }
            block = this.extensionProvider.getNext();            
        }
        return null;
    }

    private getMineralBlock(room: Room, map: Map): MineralBlock {
        let block: MineralBlock = this.mineralProvider.getNext();
        let mineralFind = room.find(FIND_MINERALS);
        if (!mineralFind.length)
            return null;
        let mineral = mineralFind[0];
        
        while (block) {
            for (var i = 0; i < 4; i++) {
                var srcLoc = block.getLocalMineralLocation();
                block.offset.x = mineral.pos.x - srcLoc.x;
                block.offset.y = mineral.pos.y - srcLoc.y;
                if (this.blockFits(block, map)) {
                    this.harvestProvider.reset();
                    return block;
                }
                block = this.mineralProvider.rotateClockwise(block);
            }
            block = this.mineralProvider.getNext();
        }
        return null;
    }

    private blockFits(block: MapBlock, map: Map): boolean {        
        for (var x = -block.border; x < block.width + block.border; x++) {
            for (var y = -block.border; y < block.height + block.border; y++) {
                if (x < 0 || y < 0 || x >= block.width || y >= block.height) { // logic for handling block borders
                    if (!this.isWalkable(map, x + block.offset.x, y + block.offset.y))
                        return false;
                } else if (this.needsWalkable(x, y, block)) {
                    if (!this.isWalkable(map, x + block.offset.x, y + block.offset.y))
                        return false;
                }
            }
        }
        
        return true;
    }

    private isWalkable(map: Map, x: number, y: number): boolean {
        if (x < 0 || x > 49 || y < 0 || y > 49)
            return false;

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
