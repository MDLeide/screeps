import { ComponentVisual } from "./lib/ComponentVisual";
import { StringBuilder } from "../util/StringBuilder";

export class Visuals {
    public componentList: ComponentVisual[] = [];
    
    public components: { [name: string]: ComponentVisual } = {};
    //public get c(): { [name: string]: ComponentVisual } { return this.components;}

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
        let sb = new StringBuilder();
        if (this.display)
            sb.appendLine("Visuals On", "green");
        else
            sb.appendLine("Visuals Off", "red");
        sb.appendLine();

        for (var i = 0; i < this.componentList.length; i++) {
            let c = this.componentList[i];
            
            if (c.display)
                sb.append("ON  ", "green");
            else
                sb.append("OFF ", "red");
            sb.append("| ");
            sb.append(c.name);
            sb.appendLine(` [${c.alternateName}]`);
        }           

        return sb.toString();
    }

    public addComponent(component: ComponentVisual): void {
        this[component.name] = component;
        this[component.alternateName] = component;

        this.components[component.name] = component;
        this.components[component.alternateName] = component;
        this.componentList.push(component);
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
