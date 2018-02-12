import { Layer } from "../../lib/map/Layer"
import { MapBlock } from "../../lib/map/MapBlock"

export class HeavyHarvestBlock {
    public static sourceLocation: number = 1;
    public static standLocation: number = 2;

    public static get(source: Source): MapBlock {
        var x = -1;
        var y = -1;
        var block = new MapBlock(3, 3);		
        block.special.setAt(0, 0, HeavyHarvestBlock.sourceLocation);
        var spawn = source.room.find<StructureSpawn>(FIND_MY_STRUCTURES);
        
        if (spawn.length) {
            var tempX = spawn[0].pos.x - source.pos.x;
            var tempY = spawn[0].pos.y - source.pos.y;
            if (tempX > 0)
                x = 1;
            else if (tempX < 0)
                x = -1;
            else
                x = 0;

            if (tempY > 0)
                y = 1;
            else if (tempY < 0)
                y = -1;
            else
                y = 0;
        }

        for (var xd = 0; xd < 3; xd++) {
            for (var yd = 0; yd < 3; yd++) {
                var xf = xd + x;
                if (xf > 1) {
                    xf -= 3;
                }
                var yf = yd + y;
                if (yf > 1) {
                    yf -= 3;
                }

                var look = source.room.lookAt(source.pos.x + xf, source.pos.y + yf);
                for (var i = 0; i < look.length; i++) {
                    if (look[i].type == LOOK_TERRAIN) {
                        if (look[i].terrain == "plain" || look[i].terrain == "swamp") {         
                            block.special.setAt(xf + 1, yf + 1, HeavyHarvestBlock.standLocation);
                            return block;
                        }
                    }
                }
            }
        }
        return null;        
    }
}
