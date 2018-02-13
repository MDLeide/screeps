import { BlockProviderBase } from "../../lib/map/BlockProviderBase";
import { MainBlock } from "../../lib/map/blocks/MainBlock";

export class MainBlockProvider extends BlockProviderBase<MainBlock> {
    public getNext(): MainBlock {
        if (this.index > 0)
            return null;
        this.index++;
        return new MainBlock(5, 5,
            MainBlockProvider.getSpawns(),
            MainBlockProvider.getTowers(),
            { x: 1, y: 0 }, // storage
            { x: 0, y: 1 }, // terminal
            MainBlockProvider.getRcl(),
            MainBlockProvider.getRoads());
    }

    private static getSpawns(): { x: number, y: number }[] {
        return [
            this.coord(4, 3),
            this.coord(3, 4),
            this.coord(4, 4)
        ];
    }

    private static getTowers(): { x: number, y: number }[] {
        return [
            this.coord(2, 1),
            this.coord(3, 1),
            this.coord(1, 2),
            this.coord(3, 2),
            this.coord(1, 3),
            this.coord(2, 3)
        ];
    }

    private static getRcl(): { level: number, locations: { x: number, y: number }[] }[] {
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
                    this.coord(3, 2),
                    this.coord(2, 4)
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
                    this.coord(3, 1),
                    this.coord(4, 3)
                ]
            },
            {
                level: 8,
                locations: [
                    this.coord(1, 2),
                    this.coord(1, 3),
                    this.coord(2, 1),
                    this.coord(3, 4)
                ]
            },            
        ];

    }

    private static getRoads(): { x: number, y: number }[] {
        return [
            this.coord(0, 0),
            this.coord(1, 1),
            this.coord(2, 2),
            this.coord(3, 3),
            this.coord(4, 2)
        ]
    }
}
