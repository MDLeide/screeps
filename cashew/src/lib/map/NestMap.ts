import { MapBlock } from "./base/MapBlock";
import { Map } from "./base/Map";

import { HarvesterBlock } from "./blocks/HarvesterBlock ";
import { ExtensionBlock } from "./blocks/ExtensionBlock";
import { MainBlock } from "./blocks/MainBlock";
import { ControllerBlock } from "./blocks/ControllerBlock";
import { LabBlock } from "./blocks/LabBlock";

export class NestMap {
    public map: Map;

    public harvestBlocks: HarvesterBlock[];
    public extensionBlock: ExtensionBlock;
    public mainBlock: MainBlock;
    public controllerBlock: ControllerBlock;
    public labBlock: LabBlock;    
}
