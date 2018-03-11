import { ComponentVisual } from "./lib/ComponentVisual";
import { StructureArtist } from "./lib/StructureArtist";
import { NestMap } from "../map/NestMap";

export class NestSpecialVisual extends ComponentVisual {
    constructor(room: string, nestMap: NestMap) {
        super("nestSpecials", "spec");

        this.room = room;
        this.nestMap = nestMap;        
    }

    public room: string;
    public nestMap: NestMap;

    public draw(): void {
        let visual = new RoomVisual();
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                let spec = this.nestMap.map.special.getAt(x, y);
                if (spec != 0)
                    visual.text(spec.toString(), x, y);
            }
        }
    }
}
