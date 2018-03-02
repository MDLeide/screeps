import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { HarvestBlock } from "../../lib/map/blocks/HarvestBlock";

export class HarvestBlockProvider extends BlockProviderBase<HarvestBlock> {
    public getNext(): HarvestBlock {
        if (this.index > 1)
            return null;
        this.index++;

        switch (this.index) {
            case 1:
                return new HarvestBlock(
                    5, 5,
                    2, 2, // source
                    3, 2, // container
                    4, 2);// link                
            case 2:
                return new HarvestBlock(
                    5, 5,
                    2, 2, // source
                    1, 3, // container
                    0, 4);// link                
            default:
                return null;
        }        
    }
}
