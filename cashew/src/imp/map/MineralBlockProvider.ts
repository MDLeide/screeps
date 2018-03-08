import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { MineralBlock } from "../../lib/map/blocks/MineralBlock";

export class MineralBlockProvider extends BlockProviderBase<MineralBlock> {
    public getNext(): MineralBlock {
        if (this.index > 4)
            return null;
        this.index++;

        switch (this.index) {
            case 1:
                return new MineralBlock(
                    5, 5,
                    2, 2, // mineral
                    2, 4, // container
                    [
                        { x: 1, y: 3 },
                        { x: 2, y: 3 },
                        { x: 3, y: 3 }
                    ]);
            case 2:
                return new MineralBlock(
                    5, 5,
                    2, 2, // mineral
                    2, 3, // container
                    [
                        { x: 1, y: 3 },
                        { x: 3, y: 3 },
                    ]);
            case 3:
                return new MineralBlock(
                    5, 5,
                    2, 2, // mineral
                    1, 3, // container
                    [
                        { x: 1, y: 2 },
                    ]);
            case 4:
                return new MineralBlock(
                    5, 5,
                    2, 2, // mineral
                    1, 4, // container
                    []);
            case 5:
                return new MineralBlock(
                    5, 5,
                    2, 2, // mineral
                    0, 4, // container
                    []);
            default:
                return null;
        }        
    }
}
