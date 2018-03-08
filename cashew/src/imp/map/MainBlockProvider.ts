import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { MainBlock } from "../../lib/map/blocks/MainBlock";

export class MainBlockProvider extends BlockProviderBase<MainBlock> {
    public getNext(): MainBlock {
        if (this.index > 0)
            return null;
        this.index++;
        return this.getBlock();
    }

    private getBlock(): MainBlock {
        let block = new MainBlock( 4, 5,
            MainBlockProvider.getSpawns(),
            MainBlockProvider.getTowers(),
            { x: 1, y: 0 }, // storage
            { x: 2, y: 0 }, // terminal
            { x: 0, y: 0 }, // observer
            { x: 2, y: 2 }, // link
            MainBlockProvider.getRcl(),
            MainBlockProvider.getRoads());
        block.border = 1;
        return block;
    }

    private static getSpawns(): { x: number, y: number }[] {
        return [
            this.coord(3, 0),
            this.coord(4, 1),
            this.coord(4, 3)
        ];
    }

    private static getTowers(): { x: number, y: number }[] {
        return [
            this.coord(0, 1),
            this.coord(1, 1),
            this.coord(0, 2),
            this.coord(0, 3),
            this.coord(1, 3),
            this.coord(2, 3)
        ];
    }

    private static getRcl(): { level: number, locations: { x: number, y: number }[] }[] {
        return [
            {
                level: 1,
                locations: [
                    this.coord(4, 1)
                ]
            },
            {
                level: 3,
                locations: [
                    this.coord(2, 3)
                ]
            },
            {
                level: 4,
                locations: [
                    this.coord(1, 0)
                ]
            },
            {
                level: 5,
                locations: [
                    this.coord(0, 3)
                ]
            },
            {
                level: 6,
                locations: [
                    this.coord(2, 0)
                ]
            },
            {
                level: 7,
                locations: [
                    this.coord(3, 0),
                    this.coord(0, 1)
                ]
            },
            {
                level: 8,
                locations: [
                    this.coord(0, 0),
                    this.coord(1, 1),
                    this.coord(0, 2),
                    this.coord(2, 2),
                    this.coord(1, 3),
                    this.coord(4, 3)
                ]
            },
            
        ];
    }

    private static getRoads(): { x: number, y: number }[] {
        return [
            this.coord(4, 0),
            this.coord(2, 1),
            this.coord(3, 1),
            this.coord(1, 2),
            this.coord(3, 2),
            this.coord(4, 2),
            this.coord(3, 3)
        ];
    }


    private static getOldBlock(): MainBlock {
        let block = new MainBlock(5, 5,
            this.getOldSpawns(),
            this.getOldTowers(),
            { x: 1, y: 0 }, // storage
            { x: 0, y: 1 }, // terminal
            { x: 3, y: 0 }, // link
            { x: 0, y: 4 }, // observer
            this.getOldRcl(),
            this.getOldRoads());
        return block
    }

    private static getOldSpawns(): { x: number, y: number }[] {
        return [
            this.coord(4, 3),
            this.coord(3, 4),
            this.coord(4, 4)
        ];
    }

    private static getOldTowers(): { x: number, y: number }[] {
        return [
            this.coord(2, 1),
            this.coord(1, 2),
            this.coord(3, 2),
            this.coord(0, 3),
            this.coord(2, 3),
            this.coord(1, 4)
        ];
    }

    private static getOldRcl(): { level: number, locations: { x: number, y: number }[] }[] {
        return [            
            {
                level: 1,
                locations: [
                    this.coord(4, 4)
                ]
            },
            {
                level: 3,
                locations: [
                    this.coord(2, 3)
                ]
            },
            {
                level: 4,
                locations: [
                    this.coord(1, 0)
                ]
            },
            {
                level: 5,
                locations: [
                    this.coord(3, 2)
                ]
            },
            {
                level: 6,
                locations: [
                    this.coord(0, 1)
                ]
            },
            {
                level: 7,
                locations: [
                    this.coord(4, 3),
                    this.coord(1, 4)
                ]
            },
            {
                level: 8,
                locations: [
                    this.coord(4, 0),
                    this.coord(2, 1),
                    this.coord(3, 1),
                    this.coord(1, 2),
                    this.coord(0, 3),
                    this.coord(3, 4)
                ]
            },            
        ];

    }

    private static getOldRoads(): { x: number, y: number }[] {
        return [
            this.coord(0, 0),
            this.coord(2, 0),
            this.coord(3, 0),
            this.coord(1, 1),
            this.coord(4, 1),
            this.coord(0, 2),
            this.coord(2, 2),
            this.coord(4, 2),
            this.coord(1, 3),
            this.coord(3, 3),
            this.coord(0, 4),
            this.coord(2, 4)
        ]
    }
}
