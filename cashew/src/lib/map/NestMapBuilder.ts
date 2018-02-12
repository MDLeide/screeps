import { NestMap } from "./NestMap";
import { IBlockProvider } from "./IBlockProvider";

import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";

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

    }

    private getControllerBlock(room: Room): ControllerBlock {
        var block: ControllerBlock;

        while (block) {

            block = this.extensionProvider.getNext();
        }
    }

    private getMainBlock(room: Room): MainBlock {
        var block: MainBlock = this.mainProvider.getNext();;

        while (block) {
            // we'll attempt to place the block, starting in the center,
            // and spiral out from there
            //todo: this is a shit implementaiton and repeats many coords
            var rings = 50 - block.width;
            var offset = Math.floor(block.width / 2);

            for (var i = 0; i < rings; i++) {
                var width = 3 + i * 2;
                var adj = Math.floor(width / 2);
                for (var x = 0; x < width; x++) {
                    for (var y = 0; y < width; y++) {
                        block.offsetX = x - adj;
                        block.offsetY = y - adj;

                        for (var k = 0; k < 7; k++) {
                            if (this.blockFits(block, room))
                                return block;

                            block = this.mainProvider.rotateClockwise(block);
                        }
                    }
                }
            }
            block = this.mainProvider.getNext();
        }
        return null;
    }

    private getHarvestBlocks(room: Room): HarvestBlock[] {
        var blocks = [];
        var sources = room.nut.seed.findSources();
        for (var i = 0; i < sources.length; i++) {
            var b = this.getHarvestBlock(sources[i]);
            if (b)
                blocks.push(b);
        }
        return blocks;
    }
    
    private getHarvestBlock(source: Source): HarvestBlock {
        var block: HarvestBlock = this.harvestProvider.getNext();

        while (block) {            
            for (var i = 0; i < 7; i++) {
                if (this.harvestBlockFits(block, source)) {
                    // calculate offset based on the source location inside the block
                    // relative to the absolute source location
                    var srcLoc = block.getSourceLocation();
                    block.offsetX = source.pos.x - srcLoc.x;
                    block.offsetY = source.pos.y - srcLoc.y;

                    return block;
                }
                block = this.harvestProvider.rotateClockwise(block);
            }
            block = this.harvestProvider.getNext();
        }
        return null;
    }
    
    private getExtensionBlock(room: Room): ExtensionBlock {
        var block: ExtensionBlock = this.extensionProvider.getNext();;

        while (block) {
            // we'll attempt to place the block, starting in the center,
            // and spiral out from there
            //todo: this is a shit implementaiton and repeats many coords
            var rings = 50 - block.width;
            var offset = Math.floor(block.width / 2);            

            for (var i = 0; i < rings; i++) {
                var width = 3 + i * 2;
                var adj = Math.floor(width / 2);
                for (var x = 0; x < width; x++) {
                    for (var y = 0; y < width; y++) {
                        block.offsetX = x - adj;
                        block.offsetY = y - adj;

                        for (var k = 0; k < 7; k++) {
                            if (this.blockFits(block, room))
                                return block;

                            block = this.extensionProvider.rotateClockwise(block);
                        }
                    }
                }
            }
            block = this.extensionProvider.getNext();
        }
        return null;
    }
    

    private blockFits(block: MapBlock, room: Room): boolean {
        for (var x = 0; x < block.width; x++) {
            for (var y = 0; y < block.height; y++) {
                if (this.needsWalkable(x, y, block)) {
                    var terrain = room.lookAt(x + block.offsetX, y + block.offsetY);
                    for (var i = 0; i < terrain.length; i++) {
                        if (terrain[i].type == LOOK_TERRAIN) {
                            if (terrain[i].terrain == "wall") {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    private harvestBlockFits(block: HarvestBlock, source: Source): boolean {
        var sLoc = block.getSourceLocation();
        var cLoc = block.getContainerLocation();
        var cLocOffset = { x: cLoc.x - sLoc.x, y: cLoc.y - sLoc.y };
        var terrain = source.room.lookAt(source.pos.x + cLocOffset.x, source.pos.y + cLocOffset.y);
        for (var i = 0; i < terrain.length; i++) {
            if (terrain[i].type == LOOK_TERRAIN)
                return terrain[i].terrain != "wall";
        }
        return false;
    }

    private controllerBlockFits(block: ControllerBlock, controller: StructureController) {
        
    }

    private needsWalkable(x: number, y: number, block: MapBlock) {
        if (block.getRoadAt(x, y))
            return true;
        if (block.getStructureAt(x, y) != null)
            return true;
        return false;
    }
}
