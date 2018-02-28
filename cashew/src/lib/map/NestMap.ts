import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";

import { HarvestBlock } from "./blocks/HarvestBlock";
import { ExtensionBlock } from "./blocks/ExtensionBlock";
import { MainBlock } from "./blocks/MainBlock";
import { ControllerBlock } from "./blocks/ControllerBlock";
import { LabBlock } from "./blocks/LabBlock";

export class NestMap {
    public static fromMemory(memory: NestMapMemory): NestMap {
        var harvestBlocks: HarvestBlock[] = [];
        for (var i = 0; i < memory.harvestBlocks.length; i++) 
            harvestBlocks.push(HarvestBlock.fromMemory(memory.harvestBlocks[i]));
        
        return new this(
            Map.fromMemory(memory.map),
            harvestBlocks,
            ExtensionBlock.fromMemory(memory.extensionBlock),
            MainBlock.fromMemory(memory.mainBlock),
            ControllerBlock.fromMemory(memory.controllerBlock),
            LabBlock.fromMemory(memory.labBlock)
        );
    }

    constructor(
        public map: Map,
        public harvestBlocks: HarvestBlock[],
        public extensionBlock: ExtensionBlock,
        public mainBlock: MainBlock,
        public controllerBlock: ControllerBlock,
        public labBlock: LabBlock) {
    }

    public save(): NestMapMemory {
        var harvestBlocks: MapBlockMemory[] = [];
        for (var i = 0; i < this.harvestBlocks.length; i++) 
            harvestBlocks.push(this.harvestBlocks[i].save());

        return {
            map: this.map.save(),
            harvestBlocks: harvestBlocks,
            extensionBlock: this.extensionBlock.save(),
            mainBlock: this.mainBlock.save(),
            controllerBlock: this.controllerBlock.save(),
            labBlock: this.labBlock.save()
        };
    }
}
