import { IBlockProvider } from "./IBlockProvider";

import { Layer } from "./base/Layer";
import { MapBlock } from "./base/MapBlock";

/**
 * Base class for classes which build MapBlocks, provides common methods.
 */
export abstract class BlockProviderBase<T extends MapBlock> implements IBlockProvider<T> {
    protected index: number = 0;

    public abstract getNext(): T;

    public reset(): void {
        this.index = 0;
    }

    public rotateClockwise(block: T): T {
        var tempWidth = block.width;
        block.width = block.height
        block.height = tempWidth;

        block.ramparts = this.rotateLayerClockwise(block.ramparts);
        block.special = this.rotateLayerClockwise(block.special);
        block.roads = this.rotateLayerClockwise(block.roads);
        block.structures = this.rotateLayerClockwise(block.structures);
        
        return block;
    }

    public rotateCounterClockwise(block: T): T {
        var tempWidth = block.width;
        block.width = block.height
        block.height = tempWidth;

        block.ramparts = this.rotateLayerCounterClockwise(block.ramparts);
        block.special = this.rotateLayerCounterClockwise(block.special);
        block.roads = this.rotateLayerCounterClockwise(block.roads);
        block.structures = this.rotateLayerCounterClockwise(block.structures);

        return block;
    }

    private rotateLayerClockwise<TLayer>(layer: Layer<TLayer>): Layer<TLayer> {
        var tempLayer = new Layer<TLayer>(layer.width, layer.height, layer.defaultValue);
        for (var x = 0; x < layer.width; x++) 
            for (var y = 0; y < layer.height; y++) 
                tempLayer.setAt(y, layer.width - x - 1, layer.getAt(x, y));
        return tempLayer;
    }

    private rotateLayerCounterClockwise<TLayer>(layer: Layer<TLayer>): Layer<TLayer> {
        var tempLayer = new Layer<TLayer>(layer.width, layer.height, layer.defaultValue);
        for (var x = 0; x < layer.width; x++)
            for (var y = 0; y < layer.height; y++)
                tempLayer.setAt(layer.height - y - 1, x, layer.getAt(x, y));
        return tempLayer;
    }


    protected static coord(x: number, y: number): { x: number, y: number } {
        return { x: x, y: y };
    }
}
