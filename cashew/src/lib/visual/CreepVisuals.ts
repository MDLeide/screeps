import { ComponentVisual } from "./lib/ComponentVisual";

export class CreepOperationVisual extends ComponentVisual {
    constructor() {
        super("creepOperation", "cop");
    }
    
    public draw(): void {
        for (let c in Game.creeps) {
            let creep = Game.creeps[c];

            let visual = new RoomVisual(creep.room.name);
            let op = creep.memory.operation ? creep.memory.operation : "Unassigned";
            visual.text(op, creep.pos.x, creep.pos.y + .5, { font: ".5" });
        }
    }
}
