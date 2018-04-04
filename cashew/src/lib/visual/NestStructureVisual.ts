import { ComponentVisual } from "./lib/ComponentVisual";
import { StructureArtist } from "./lib/StructureArtist";
import { NestMap } from "../map/NestMap";

export class NestStructureVisual extends ComponentVisual {
    constructor() {
        super("nestStructures", "struct");
        this.structureArtist = new StructureArtist();
    }

    public structureArtist: StructureArtist;

    public draw(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            let nestMap = colony.nest.nestMap;

            for (var x = 0; x < 50; x++) {
                for (var y = 0; y < 50; y++) {
                    let struct = nestMap.map.structures.getAt(x, y);
                    if (struct)
                        this.drawStructure(x, y, struct, colony.nest.roomName);
                    if (nestMap.map.ramparts.getAt(x, y))
                        this.drawStructure(x, y, STRUCTURE_RAMPART, colony.nest.roomName);
                }
            }
        }
    }

    private drawStructure(x: number, y: number, structure: StructureConstant, room: string): void {
        this.structureArtist.drawStructure(structure, x, y, room);
    }
}
