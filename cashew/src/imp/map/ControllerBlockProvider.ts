import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { ControllerBlock } from "../../lib/map/blocks/ControllerBlock";

export class ControllerBlockProvider extends BlockProviderBase<ControllerBlock> {    
    public getNext(): ControllerBlock {
        if (this.index > 0)
            return null;
        this.index++;

        var block = new ControllerBlock(
            9, 3, // size [y, x]
            1, 4, // controller
            1, 8, // container
            [ // stand locations
                { x: 0, y: 7 },
                { x: 1, y: 7 },
                { x: 2, y: 7 },
            ]
        );
        return block;
    }    
}
