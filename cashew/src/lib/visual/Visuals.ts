import { ComponentVisual } from "./lib/ComponentVisual";

export class Visuals {
    constructor() {
    }


    public components: { [name: string]: ComponentVisual } = {};


    public get display(): boolean {
        return Memory.visuals["visualsMain"];
    }
    public set display(val: boolean){
        Memory.visuals["visualsMain"] = val;
    }


    public on(): void {
        this.display = true;
    }
    public off(): void {
        this.display = false;
    }

    public help(): string {
        let str = "";
        for (let key in this.components)
            str += `${this.components[key].name} [${this.components[key].alternateName}]</br>`;
        return str;
    }

    public addComponent(component: ComponentVisual): void {
        this.components[component.name] = component;
        this.components[component.alternateName] = component;
    }

    public draw(): void {
        if (!this.display)
            return;

        for (let key in this.components) 
            if (this.components[key].display)
                this.components[key].draw();        
    }
}
