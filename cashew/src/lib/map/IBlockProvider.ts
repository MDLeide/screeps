import { MapBlock } from "./base/MapBlock";

export interface IBlockProvider<T extends MapBlock> {
    getNext(): T;
    rotateClockwise(block: T): T;
    rotateCounterClockwise(block: T): T;
    reset(): void;
}
