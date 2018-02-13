import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";

import { HarvestBlock } from "./blocks/HarvestBlock";
import { ExtensionBlock } from "./blocks/ExtensionBlock";
import { MainBlock } from "./blocks/MainBlock";
import { ControllerBlock } from "./blocks/ControllerBlock";
import { LabBlock } from "./blocks/LabBlock";

export class NestMap {
    public map: Map;

    public harvestBlocks: HarvestBlock[];
    public extensionBlock: ExtensionBlock;
    public mainBlock: MainBlock;
    public controllerBlock: ControllerBlock;
    public labBlock: LabBlock;    
}
