import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { HarvestBlock } from "../../lib/map/blocks/HarvestBlock";

export class HarvestBlockProvider extends BlockProviderBase<HarvestBlock> {
    public getNext(): HarvestBlock {
        if (this.index > 1)
            return null;
        this.index++;

        switch (this.index) {
            case 1:
                var block = new HarvestBlock(
                    3, 3,
                    1, 1, // source
                    1, 2); // container
                return block;
            case 2:
                var block = new HarvestBlock(
                    3, 3,
                    1, 1, // source
                    0, 2); // container
                return block;
            default:
                return null;
        }        
    }
}
