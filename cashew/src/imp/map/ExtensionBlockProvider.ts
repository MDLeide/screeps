import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { ExtensionBlock } from "../../lib/map/blocks/ExtensionBlock";

export class ExtensionBlockProvider extends BlockProviderBase<ExtensionBlock> {
    public getNext(): ExtensionBlock {
        if (this.index > 0)
            return null;
        this.index++;

        var block = new ExtensionBlock(11, 11, 5, 5,
            ExtensionBlockProvider.getExtensions(),
            ExtensionBlockProvider.getRcl(),
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
            this.coord(0, 4),

            this.coord(0, 5),

            this.coord(2, 5),
            this.coord(3, 5),
            this.coord(4, 5),

            this.coord(6, 5),
            this.coord(7, 5),
            this.coord(8, 5),

            this.coord(0, 5),

            this.coord(0, 6),
            this.coord(1, 6),

            this.coord(3, 6),

            this.coord(5, 6),
            this.coord(6, 6),
            this.coord(7, 6),

            this.coord(9, 6),
            this.coord(0, 6),

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

            this.coord(4, 1),
            this.coord(5, 1),
            this.coord(6, 1)
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

    private static getRcl(): { level: number, locations: { x: number, y: number }[] }[] {
        return [
            {
                level: 2,
                locations: [
                    this.coord(6, 6),
                    this.coord(7, 6),
                    this.coord(8, 7),
                    this.coord(9, 7),
                    this.coord(7, 8)
                ]
            },
            {
                level: 3,
                locations: [
                    this.coord(6, 7),
                    this.coord(5, 8),
                    this.coord(6, 9),
                    this.coord(7, 9),
                    this.coord(6, 1)
                ]
            },
            {
                level: 4,
                locations: [
                    this.coord(9, 4),
                    this.coord(0, 4),
                    this.coord(8, 5),
                    this.coord(0, 5),
                    this.coord(9, 9),
                    this.coord(0, 9),
                    this.coord(5, 7),
                    this.coord(4, 9),
                    this.coord(4, 1),
                    this.coord(5, 1)
                ]
            },
            {
                level: 5,
                locations: [
                    this.coord(8, 3),
                    this.coord(9, 3),
                    this.coord(7, 4),
                    this.coord(7, 5),
                    this.coord(3, 6),
                    this.coord(2, 7),
                    this.coord(4, 7),
                    this.coord(2, 8),
                    this.coord(3, 8),
                    this.coord(3, 9)
                ]
            },
            {
                level: 6,
                locations: [
                    this.coord(6, 1),
                    this.coord(7, 1),
                    this.coord(5, 2),
                    this.coord(7, 2),
                    this.coord(8, 2),
                    this.coord(5, 3),
                    this.coord(6, 3),
                    this.coord(3, 5),
                    this.coord(1, 6),
                    this.coord(1, 7)
                ]
            },
            {
                level: 7,
                locations: [
                    this.coord(4, 0),
                    this.coord(5, 0),
                    this.coord(6, 0),
                    this.coord(4, 1),
                    this.coord(1, 3),
                    this.coord(0, 4),
                    this.coord(1, 4),
                    this.coord(0, 5),
                    this.coord(2, 5),
                    this.coord(0, 6)
                ]
            },
            {
                level: 8,
                locations: [
                    this.coord(3, 1),
                    this.coord(3, 2),
                    this.coord(2, 3),
                    this.coord(4, 3),
                    this.coord(3, 4),
                    this.coord(4, 4),
                    this.coord(5, 4),
                    this.coord(4, 5),
                    this.coord(6, 5),
                    this.coord(5, 6)
                ]
            }
        ];
    }
}

