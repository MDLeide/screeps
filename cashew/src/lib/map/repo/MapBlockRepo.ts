import { MapBlock } from "../MapBlock";
import { Repository } from "../../memory/Repository";

export class MapBlockRepo extends Repository<MapBlock>{
    constructor() {
        super("mapBlocks", MapBlockRepo.hydrate)
    }

    private static hydrate(state: any): MapBlock {
        var block = Object.create(MapBlock.prototype);
        block.state = state;
        return block;
    }
}
