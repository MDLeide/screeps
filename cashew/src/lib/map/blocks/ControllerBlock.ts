import { MapBlock } from "../base/MapBlock";

export class ControllerBlock extends MapBlock {
    constructor(
        height: number,
        width: number,
        controllerX: number,
        controllerY: number,
        containerX: number,
        containerY: number,
        standLocations: {x: number, y: number}[]) {
        super(height, width, 0, 0);

        this.special.setAt(controllerX, controllerY, ControllerBlock.ControllerToken);
        this.special.setAt(containerX, containerY, ControllerBlock.ContainerToken);
        this.structures.setAt(containerX, containerY, STRUCTURE_CONTAINER);
        for (var i = 0; i < standLocations.length; i++) 
            this.special.setAt(standLocations[i].x, standLocations[i].y, ControllerBlock.StandToken);        
    }

    public static readonly ControllerToken: number = 1;
    public static readonly ContainerToken: number = 2;
    public static readonly StandToken: number = 3;

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



    public getControllerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ControllerToken)
                    return { x: x + this.offsetX, y: y + this.offsetY};
            }
        }
        return null;
    }

    public getContainerLocation(): { x: number, y: number } {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.ContainerToken)
                    return { x: x + this.offsetX, y: y + this.offsetY };
            }
        }
        return null;
    }

    public getStandLocations(): { x: number, y: number }[] {
        var locs = []
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.special.getAt(x, y) == ControllerBlock.StandToken)
                    locs.push({ x: x + this.offsetX, y: y + this.offsetY });
            }
        }
        return locs;
    }


}
