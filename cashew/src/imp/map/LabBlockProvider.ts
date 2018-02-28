import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { LabBlock } from "../../lib/map/blocks/LabBlock";

export class LabBlockProvider extends BlockProviderBase<LabBlock> {
    public getNext(): LabBlock {
        this.index++;
        switch (this.index) {
            case 1:
                return new LabBlock(
                    4, 4, // size [y, x]
                    [ // labs
                        { x: 0, y: 1 },
                        { x: 0, y: 2 },
                        { x: 1, y: 0 },
                        { x: 1, y: 2 },
                        { x: 1, y: 3 },
                        { x: 2, y: 0 },
                        { x: 2, y: 1 },
                        { x: 2, y: 3 },
                        { x: 3, y: 1 },
                        { x: 3, y: 2 }
                    ],
                    [ // rcl
                        {
                            level: 6,
                            locations:
                            [
                                { x: 2, y: 0 },
                                { x: 2, y: 1 },
                                { x: 3, y: 1 }
                            ]
                        },
                        {
                            level: 7,
                            locations:
                            [
                                { x: 0, y: 2 },
                                { x: 1, y: 2 },
                                { x: 1, y: 3 }
                            ]
                        },
                        {
                            level: 8,
                            locations:
                            [
                                { x: 0, y: 1 },
                                { x: 1, y: 0 },
                                { x: 2, y: 3 },
                                { x: 3, y: 2 }
                            ]
                        }
                    ],
                    [] // roads
                );
            default:
                return null;
        }
    }
}

