import { ComponentVisual } from "./ComponentVisual";

/** Very basic line graph visual. */
export class LineGraphVisual extends ComponentVisual {

    public points: number[] = [];

    /** Trims [@count] points from the back of the points array.*/
    public trim(count: number = 1): void {
        if (this.points.length < count)
            return;
        this.points.splice(0, count);
    }

    public clear(): void {
        this.points = [];
    }
    
    public unshiftPoints(val: number | number[]): void {
        if (typeof val == "number")
            this.unshiftPoints([val]);
        else
            for (var i = 0; i < val.length; i++)
                this.points.unshift(val[i]);
    }

    public addPoints(val: number | number[]): void {
        if (typeof val == "number")
            this.addPoints([val]);
        else
            for (var i = 0; i < val.length; i++)
                this.points.push(val[i]);
    }

    public insertPoint(val: number, index: number): void {
        if (index < 0 || index >= this.points.length)
            return;
        this.points.splice(index, 0, val);        
    }

    public draw(): void {

    }
}
