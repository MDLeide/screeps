import { ComponentVisual } from "./lib/ComponentVisual";
import { Colony } from "../colony/Colony";
import { VisualText } from "./lib/VisualText";

export class ColonyInfoVisual extends ComponentVisual {
    constructor() {
        super("colonyInfo", "info");
    }
    
    public draw(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            let vt = this.getGeneralText(colony);

            vt.alignCenter();
            vt.draw(this.x, this.y, colony.nest.roomName);
        }
    }

    private getGeneralText(colony: Colony): VisualText {
        let vt = new VisualText();
        vt.append(colony.nest.roomName);
        vt.append(" | ");
        let progress = Math.trunc(colony.nest.room.controller.progress / colony.nest.room.controller.progressTotal*100);
        vt.append(`RCL ${colony.nest.room.controller.level} - ${progress}%`);
        vt.append(" | ");
        let rcl = colony.getEffectiveRcl();
        vt.append(`${rcl.toString(true)}`);
        vt.append(" | ");
        let ops = colony.operations.runners.length;
        vt.append(ops + " operations");
        let pop = colony.population.alive.length;
        vt.append(" | ");
        vt.append(pop + " creeps");
        vt.append(" | ");
        let threat = colony.watchtower.threatScore;
        if (threat > 0)
            vt.append(threat, "red");
        else
            vt.append(threat, "green");
        return vt;
    }
}
