import { NestMapVisual } from "./NestMapVisual";
import { Empire } from "../empire/Empire"
export class Visuals {
    public help(): string {
        return "toggleNestStructures() - turns on/off drawing of structures from the nest plan </br>" +
            "toggleNestSpecials() - turns on/off drawing of special values from the nest plan";
    }

    public toggleNestStructures(): void {
        Memory.visuals.drawNestMapStructures = !Memory.visuals.drawNestMapStructures;
    }

    public toggleNestSpecials(): void {
        Memory.visuals.drawNestMapSpecials = !Memory.visuals.drawNestMapSpecials;
    }

    public update(empire: Empire): void {
        for (var i = 0; i < empire.colonies.length; i++) {
            var visual = new NestMapVisual(empire.colonies[i].nest.roomName, empire.colonies[i].nest.nestMap);

            if (Memory.visuals.drawNestMapStructures)
                visual.drawStructures();

            if (Memory.visuals.drawNestMapSpecials)
                visual.drawRcl();
        }
    }
}
