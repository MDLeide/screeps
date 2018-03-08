import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { ExtensionBlock } from "../../lib/map/blocks/ExtensionBlock";

export class ExtensionBlockProvider extends BlockProviderBase<ExtensionBlock> {
    public getNext(): ExtensionBlock {
        if (this.index > 0)
            return null;
        this.index++;

        var block = new ExtensionBlock(11, 11, 5, 5,
            ExtensionBlockProvider.getExtensions(),
            ExtensionBlockProvider.getSpecial(),
            ExtensionBlockProvider.getPathA(),
            ExtensionBlockProvider.getPathB(),
            { x: 0, y: 5 },
            { x: 10, y: 5 },
            ExtensionBlockProvider.getRoads()
        );
        return block;
    }


    private static getExtensions(): { x: number, y: number }[] {
        return [
            this.coord(4, 0),
            this.coord(5, 0),
            this.coord(6, 0),


            this.coord(3, 1),
            this.coord(4, 1),

            this.coord(6, 1),
            this.coord(7, 1),


            this.coord(2, 2),
            this.coord(3, 2),

            this.coord(5, 2),

            this.coord(7, 2),
            this.coord(8, 2),


            this.coord(1, 3),
            this.coord(2, 3),

            this.coord(4, 3),
            this.coord(5, 3),
            this.coord(6, 3),

            this.coord(8, 3),
            this.coord(9, 3),


            this.coord(0, 4),
            this.coord(1, 4),

            this.coord(3, 4),
            this.coord(4, 4),
            this.coord(5, 4),

            this.coord(7, 4),

            this.coord(9, 4),
            this.coord(10, 4),

            
            this.coord(2, 5),
            this.coord(3, 5),
            this.coord(4, 5),

            this.coord(6, 5),
            this.coord(7, 5),
            this.coord(8, 5),            


            this.coord(0, 6),
            this.coord(1, 6),

            this.coord(3, 6),

            this.coord(5, 6),
            this.coord(6, 6),
            this.coord(7, 6),

            this.coord(9, 6),
            this.coord(10, 6),


            this.coord(1, 7),
            this.coord(2, 7),

            this.coord(4, 7),
            this.coord(5, 7),
            this.coord(6, 7),

            this.coord(8, 7),
            this.coord(9, 7),


            this.coord(2, 8),
            this.coord(3, 8),

            this.coord(5, 8),

            this.coord(7, 8),
            this.coord(8, 8),


            this.coord(3, 9),
            this.coord(4, 9),

            this.coord(6, 9),
            this.coord(7, 9),


            this.coord(4, 10),
            this.coord(5, 10),
            this.coord(6, 10)
        ]
    }


    private static getRoads(): { x: number, y: number }[] {
        return [
            this.coord(5, 1),

            this.coord(4, 2),
            this.coord(6, 2),

            this.coord(3, 3),
            this.coord(7, 3),

            this.coord(2, 4),
            this.coord(6, 4),
            this.coord(8, 4),

            this.coord(1, 5),
            this.coord(9, 5),

            this.coord(2, 6),
            this.coord(4, 6),
            this.coord(8, 6),

            this.coord(3, 7),
            this.coord(7, 7),

            this.coord(4, 8),
            this.coord(6, 8),

            this.coord(5, 9)
        ];
    }

    private static getSpecial(): { x: number, y: number }[] {
        return [
            { x: 4, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 6 },
            { x: 6, y: 5 },
            { x: 7, y: 5 },
            { x: 7, y: 4 },
            { x: 5, y: 6 },
            { x: 5, y: 7 },
            { x: 4, y: 7 },
            { x: 5, y: 4 },
            { x: 5, y: 3 },
            { x: 6, y: 3 },
            { x: 2, y: 7 },
            { x: 2, y: 8 },
            { x: 3, y: 8 },
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 8, y: 3 },
            { x: 3, y: 9 },
            { x: 4, y: 9 },
            { x: 5, y: 8 },
            { x: 5, y: 2 },
            { x: 6, y: 1 },
            { x: 7, y: 1 },
            { x: 4, y: 10 },
            { x: 5, y: 10 },
            { x: 6, y: 10 },
            { x: 6, y: 9 },
            { x: 4, y: 1 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
            { x: 6, y: 7 },
            { x: 7, y: 8 },
            { x: 7, y: 9 },
            { x: 3, y: 1 },
            { x: 3, y: 2 },
            { x: 4, y: 3 },
            { x: 6, y: 6 },
            { x: 7, y: 6 },
            { x: 8, y: 7 },
            { x: 8, y: 8 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 4 },
            { x: 8, y: 5 },
            { x: 9, y: 6 },
            { x: 9, y: 7 },
            { x: 1, y: 3 },
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 9, y: 4 },
            { x: 10, y: 4 },
            { x: 10, y: 6 },
            { x: 0, y: 4 },
            { x: 0, y: 6 },
            { x: 1, y: 6 },
            { x: 9, y: 3 },
            { x: 1, y: 7 },
            { x: 4, y: 6 },
            { x: 3, y: 7 },
            { x: 4, y: 8 },
            { x: 5, y: 9 },
            { x: 6, y: 8 },
            { x: 7, y: 7 },
            { x: 8, y: 6 },
            { x: 9, y: 5 },
            { x: 8, y: 4 },
            { x: 6, y: 4 },
            { x: 7, y: 3 },
            { x: 6, y: 2 },
            { x: 5, y: 1 },
            { x: 4, y: 2 },
            { x: 3, y: 3 },
            { x: 2, y: 4 },
            { x: 1, y: 5 },
            { x: 2, y: 6 }
        ]
    }


    private static getPathA(): { x: number, y: number }[] {
        return [
            { x: 4, y: 6 },
            { x: 3, y: 7 },
            { x: 4, y: 8 },
            { x: 5, y: 9 },
            { x: 6, y: 8 },
            { x: 7, y: 7 },
            { x: 8, y: 6 },
            { x: 9, y: 5 },
            { x: 8, y: 4 }
        ];
    }

    private static getPathB(): { x: number, y: number }[] {
        return [
            { x: 6, y: 4 },
            { x: 7, y: 3 },
            { x: 6, y: 2 },
            { x: 5, y: 1 },
            { x: 4, y: 2 },
            { x: 3, y: 3 },
            { x: 2, y: 4 },
            { x: 1, y: 5 },
            { x: 2, y: 6 },
        ];
    }
}

