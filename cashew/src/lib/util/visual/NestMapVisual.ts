import { Map } from "../../map/base/Map";
import { MapBlock } from "../../map/base/MapBlock";
import { Layer } from "../../map/base/Layer";
import { NestMap } from "../../map/NestMap";
import { StructureArtist } from "./lib/StructureArtist";

export class NestMapVisual {
    constructor(room: string, nestMap: NestMap) {
        this.nestMap = nestMap;
        this.structureArtist = new StructureArtist(room);
        this.room = room;
    }


    public room: string;
    public nestMap: NestMap;
    public structureArtist: StructureArtist;


    public drawStructures(): void {
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                let struct = this.nestMap.map.structures.getAt(x, y);
                if (struct)
                    this.drawStructure(x, y, struct);
                if (this.nestMap.map.ramparts.getAt(x, y))
                    this.drawStructure(x, y, STRUCTURE_RAMPART);
            }
        }
    }

    public drawSpecials(): void {
        let visual = new RoomVisual();
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                let spec = this.nestMap.map.special.getAt(x, y);
                if (spec != 0)
                    visual.text(spec.toString(), x, y);
            }
        }
    }
        
    private drawRoad(x: number, y: number): void {

    }
        
    private drawStructure(x: number, y: number, structure: StructureConstant): void {
        this.structureArtist.drawStructure(structure, x, y);
    }
}
