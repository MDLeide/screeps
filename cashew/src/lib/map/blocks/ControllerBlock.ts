import { Layer } from "../base/Layer";
import { MapBlock } from "../base/MapBlock";

export class ControllerBlock extends MapBlock {
    public static fromMemory(memory: MapBlockMemory): ControllerBlock {
        var block = Object.create(ControllerBlock.prototype) as ControllerBlock;
        block.roads = Layer.fromMemory(memory.roads);
        block.structures = Layer.fromMemory(memory.structures);
        block.ramparts = Layer.fromMemory(memory.ramparts);
        block.special = Layer.fromMemory(memory.special);
        block.height = memory.height;
        block.width = memory.width;
        block.offset = { x: memory.offset.x, y: memory.offset.y };
        return block;
    }

    constructor(
        height: number,
        width: number,
        controllerX: number,
        controllerY: number,
        containerX: number,
        containerY: number,
        linkX: number,
        linkY: number,
        standLocations: {x: number, y: number}[]) {
        super(height, width, { x: 0, y: 0 });

        this.special.setAt(controllerX, controllerY, ControllerBlock.ControllerToken);
        this.special.setAt(containerX, containerY, ControllerBlock.ContainerToken);
        this.special.setAt(linkX, linkY, ControllerBlock.LinkToken);
        this.structures.setAt(containerX, containerY, STRUCTURE_CONTAINER);
        for (var i = 0; i < standLocations.length; i++) 
            this.special.setAt(standLocations[i].x, standLocations[i].y, ControllerBlock.StandToken);        
    }


    public static readonly ControllerToken: number = 1;
    public static readonly ContainerToken: number = 2;
    public static readonly StandToken: number = 3;
    public static readonly LinkToken: number = 4;


    public getLocalLinkLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.LinkToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getLocalControllerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ControllerToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getLocalContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ContainerToken)
                    return { x: x, y: y };
            }
        }
        return null;
    }

    public getLocalStandLocations(): { x: number, y: number }[] {
        var locs = []
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.StandToken)
                    locs.push({ x: x, y: y });
            }
        }
        return locs;
    }


    public getLinkLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.LinkToken)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getControllerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ControllerToken)
                    return { x: x + this.offset.x, y: y + this.offset.y};
            }
        }
        return null;
    }

    public getContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ContainerToken)
                    return { x: x + this.offset.x, y: y + this.offset.y };
            }
        }
        return null;
    }

    public getStandLocations(): { x: number, y: number }[] {
        var locs = []
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.StandToken)
                    locs.push({ x: x + this.offset.x, y: y + this.offset.y });
            }
        }
        return locs;
    }


}
