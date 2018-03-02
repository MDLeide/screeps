import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { ControllerBlock } from "../../lib/map/blocks/ControllerBlock";

export class ControllerBlockProvider extends BlockProviderBase<ControllerBlock> {    
    public getNext(): ControllerBlock {
        this.index++;
        switch (this.index) {
            case 1:                
                return new ControllerBlock(
                    9, 3, // size [y, x]
                    1, 4, // controller
                    1, 8, // container
                    1, 6, // link
                    [ // stand locations
                        { x: 0, y: 7 },
                        { x: 1, y: 7 },
                        { x: 2, y: 7 },
                    ]
                );
            case 2:
                return new ControllerBlock(
                    7, 7, // size [y, x]
                    3, 3, // controller
                    6, 6, // container
                    4, 4, // link
                    [ // stand locations
                        { x: 3, y: 6 },
                        { x: 3, y: 7 },
                        { x: 4, y: 6 },
                    ]
                );
            default:
                return null;
        }
    }    
}
