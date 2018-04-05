export abstract class ComponentVisual {
    constructor(name: string, alternateName?:string) {
        this.name = name;
        this.alternateName = alternateName;
    }

    public name: string;
    public alternateName: string;
    public x: number = 0;
    public y: number = 0;
    public get display(): boolean {
        return Memory.visuals[this.name];
    }
    public set display(val: boolean ) {
        Memory.visuals[this.name] = val;
    }

    public on(): void {
        this.display = true;
    }
    public off(): void {
        this.display = false;
    }

    public abstract draw(): void;
}

