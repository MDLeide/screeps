import { ComponentVisual } from "./lib/ComponentVisual";
import { VisualText } from "./lib/VisualText";
import { Colony } from "lib/colony/Colony";

export class SpawnQueueVisual extends ComponentVisual {
    constructor() {
        super("spawnQueue", "sq");
    }

    public draw(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];
            let vt = this.getText(c);
            vt.draw(this.x, this.y, c.nest.roomName);
        }
    }

    private getText(colony: Colony): VisualText {
        let vt = new VisualText();
        
        for (var i = 0; i < colony.nest.spawnQueue.length; i++) {
            let req = colony.nest.spawnQueue[i];
            let mem = Memory.creeps[req.name];            
            vt.appendLine(`${i+1} [${req.priority}] ${req.name} - ${req.body.type} [${mem ? mem.operation : ""}]`);
        }

        return vt;
    }
}
