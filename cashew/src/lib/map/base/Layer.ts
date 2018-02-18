export class Layer<T> {
    public static fromMemory<T>(memory: LayerMemory<T>): Layer<T> {
        return new this(memory.height, memory.width, memory.defaultValue, memory.array);
    }

    constructor(height: number, width: number, defaultValue: T, array?: T[][]) {
        this.defaultValue = defaultValue;
        this.height = height;
        this.width = width;
        if (array) {
            this.array = array;
        }
        else {
            this.array = [];

            for (var i = 0; i < width; i++) {
                this.array.push([]);
                for (var j = 0; j < height; j++)
                    this.array[i].push(defaultValue);
            }
        }
    }
    
    public defaultValue: T;
    public height: number;
    public width: number;
    public array: T[][];

    public setAt(x: number, y: number, val: T): void {
        this.array[x][y] = val;
    }

    public getAt(x: number, y: number): T {
        return this.array[x][y];
    }

    public save(): LayerMemory<T> {
        return {
            height: this.height,
            width: this.width,
            defaultValue: this.defaultValue,
            array: this.array
        };
    }
}


