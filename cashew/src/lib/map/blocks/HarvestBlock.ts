import { MapBlock } from "../base/MapBlock";

export class HarvestBlock extends MapBlock {
    constructor(
        height: number,
        width: number,
        sourceX: number,
        sourceY: number,
        containerX: number,
        containerY: number) {
        super(height, width, 0, 0);
        this.structures.setAt(containerX, containerY, STRUCTURE_CONTAINER);
        this.special.setAt(containerX, containerY, HarvestBlock.ContainerToken);
        this.special.setAt(sourceX, sourceY, HarvestBlock.SourceToken);
    }

    public static readonly SourceToken: number = 1;
    public static readonly ContainerToken: number = 2;

    public getContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == HarvestBlock.ContainerToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getSourceLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == HarvestBlock.SourceToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }
}
