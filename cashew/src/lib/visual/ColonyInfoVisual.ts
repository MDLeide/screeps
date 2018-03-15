import { ComponentVisual } from "./lib/ComponentVisual";
import { Colony } from "../colony/Colony";
import { VisualText } from "./lib/VisualText";

export class ColonyInfoVisual extends ComponentVisual {
    constructor(colony: Colony) {
        super("colonyInfo", "info");
        this.colony = colony;
    }

    public colony: Colony;

    public draw(): void {
        let vt = this.getGeneralText(this.colony);
        
        vt.alignCenter();
        vt.draw(this.x, this.y, this.colony.nest.roomName);
    }

    private getGeneralText(colony: Colony): VisualText {
        let vt = new VisualText();
        vt.append(colony.nest.roomName);
        vt.append(" | ");
        vt.append(colony.progress.mostRecentMilestone.name);
        vt.append(" | ");
        let ops = _.sum(colony.operationPlans, p => p.operationGroup.runners.length);
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
