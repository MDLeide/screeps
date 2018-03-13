import { ComponentVisual } from "./lib/ComponentVisual";

export class Visuals {
    constructor() {
    }


    public components: { [name: string]: ComponentVisual } = {};
    public get c(): { [name: string]: ComponentVisual } { return this.components;}

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
        let drawn: string[] = []
        for (let key in this.components) {
            if (this.components[key].display) {
                let skip = false;
                for (var i = 0; i < drawn.length; i++) {
                    if (drawn[i] == this.components[key].name) {
                        skip = true;
                        break;
                    }                        
                }
                if (skip)
                    continue;

                this.components[key].draw();
                drawn.push(this.components[key].name);
            }                
        }            
    }
}
