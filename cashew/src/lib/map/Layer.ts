export class Layer<T> {
    private _array: any[][];

    constructor(height: number, width: number, defaultValue: T) {
        this.state = {
            height: height,
            width: width,
            array: []
        }
        for (var i = 0; i < width; i++) {
            this.state.array.push([]);

            for (var i = 0; i < height; i++) {
                this.state.array[i].push(defaultValue);
            }
        }
    }

    public state: LayerMemory;

    public get height(): number { return this.state.height; }
    public get width(): number { return this.state.width; }
    public get array(): T[][] {
        if (!this._array) {
            this._array = this.state.array;
        }
        return this._array;
    }

    public setAt(x: number, y: number, val: T): void {
        this.array[x][y] = val;
    }

    public getAt(x: number, y: number): T {
        return this.array[x][y];
    }

    public static LoadFromState<T>(state: LayerMemory): Layer<T> {
        var obj = Object.create(Layer.prototype);
        obj.state = state;
        return obj;
    }
}


