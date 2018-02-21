import { Map } from "../map/base/Map";
import { MapBlock } from "../map/base/MapBlock";
import { Layer } from "../map/base/Layer";
import { NestMap } from "../map/NestMap";
import { StructureArtist } from "./StructureArtist";

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
        this.structures(this.nestMap.controllerBlock);
        this.structures(this.nestMap.extensionBlock);        
        this.structures(this.nestMap.labBlock);
        this.structures(this.nestMap.mainBlock);
        for (var i = 0; i < this.nestMap.harvestBlocks.length; i++) {
            this.structures(this.nestMap.harvestBlocks[i]);
        }
    }

    public drawRcl(): void {
        this.rcl(this.nestMap.controllerBlock);
        this.rcl(this.nestMap.extensionBlock);
        this.rcl(this.nestMap.labBlock);
        this.rcl(this.nestMap.mainBlock);
        for (var i = 0; i < this.nestMap.harvestBlocks.length; i++) {
            this.rcl(this.nestMap.harvestBlocks[i]);
        }
    }

    private structures(mapBlock: MapBlock): void {
        for (var x = 0; x < mapBlock.width; x++) {
            for (var y = 0; y < mapBlock.height; y++) {
                var struct = mapBlock.getStructureAt(x, y);
                if (struct)
                    this.drawStructure(x + mapBlock.offset.x , y + mapBlock.offset.y, struct);
            }
        }
    }

    private rcl(mapBlock: MapBlock): void {
        for (var x = 0; x < mapBlock.width; x++) {
            for (var y = 0; y < mapBlock.height; y++) {
                var special = mapBlock.getSpecialAt(x, y);
                if (special != 0)
                    this.drawSpecial(x + mapBlock.offset.x, y + mapBlock.offset.y, special);
            }
        }
    }

    private drawRoad(x: number, y: number): void {

    }

    private drawRampart(x: number, y: number): void {

    }

    private drawSpecial(x: number, y: number, val: number): void {
        var visual = new RoomVisual(this.room);
        visual.text(val.toString(), x, y);
    }

    private drawStructure(x: number, y: number, structure: StructureConstant): void {
        this.structureArtist.drawStructure(structure, x, y);
    }
}
