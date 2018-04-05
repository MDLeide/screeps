import { ComponentVisual } from "./lib/ComponentVisual";
import { StructureArtist } from "./lib/StructureArtist";
import { NestMap } from "../map/NestMap";

export class NestSpecialVisual extends ComponentVisual {
    constructor() {
        super("nestSpecials", "spec");     
    }

    public draw(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            let visual = new RoomVisual(colony.nest.roomName);
            
            for (var x = 0; x < 50; x++) {
                for (var y = 0; y < 50; y++) {
                    let spec = colony.nest.nestMap.map.special.getAt(x, y);
                    if (spec != 0)
                        visual.text(spec.toString(), x, y);
                }
            }
        }        
    }
}
