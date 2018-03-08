import { Map } from "../../lib/map/base/Map";
import { NestMap } from "../../lib/map/NestMap";

export class WallProvider {
    public static generateWalls(room: Room, nestMap: NestMap): void {
        let walls = this.getWallLocations(room, 3);
        for (var i = 0; i < walls.length; i++)
            if (!nestMap.map.structures.getAt(walls[i].x, walls[i].y) && nestMap.map.getTerrainAt(walls[i].x, walls[i].y) != "wall")
                nestMap.map.structures.setAt(walls[i].x, walls[i].y, STRUCTURE_WALL);
        this.replaceWallsWithRamparts(nestMap.map, 3);
    }

    static replaceWallsWithRamparts(map: Map, interval: number): void {
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                if (map.getStructureAt(x, y) != STRUCTURE_WALL)
                    continue;

                if (this.isNorthSouth(x, y, map) && y % interval == 0) {
                    map.structures.setAt(x, y, undefined);
                    map.ramparts.setAt(x, y, true);
                } else if (this.isEastWest(x, y, map) && x % interval == 0) {
                    map.structures.setAt(x, y, undefined);
                    map.ramparts.setAt(x, y, true);
                }
            }
        }
    }

    static isNorthSouth(x: number, y: number, map: Map): boolean {        
        return (y == 0 || map.getStructureAt(x, y - 1) == STRUCTURE_WALL || map.getTerrainAt(x, y - 1) == "wall")
            && (y == 49 || map.getStructureAt(x, y + 1) == STRUCTURE_WALL || map.getTerrainAt(x, y + 1) == "wall")
            && (x == 0 || map.getStructureAt(x - 1, y) != STRUCTURE_WALL && map.getTerrainAt(x - 1, y) != "wall")
            && (x == 49 || map.getStructureAt(x + 1, y) != STRUCTURE_WALL && map.getTerrainAt(x + 1, y) != "wall");
    }

    static isEastWest(x: number, y: number, map: Map): boolean {
        return (x == 0 || map.getStructureAt(x - 1, y) == STRUCTURE_WALL || map.getTerrainAt(x - 1, y) == "wall")
            && (x == 49 || map.getStructureAt(x + 1, y) == STRUCTURE_WALL || map.getTerrainAt(x + 1, y) == "wall")
            && (y == 0 || map.getStructureAt(x, y - 1) != STRUCTURE_WALL && map.getTerrainAt(x, y - 1) != "wall")
            && (y == 49 || map.getStructureAt(x, y + 1) != STRUCTURE_WALL && map.getTerrainAt(x, y + 1) != "wall");
    }
    
    public static getWallLocations(room: Room, radius: number): { x: number, y: number }[] {
        let walls = this.makeNorthExitWall(room, radius);
        walls = walls.concat(this.makeSouthExitWall(room, radius));
        walls = walls.concat(this.makeWestExitWall(room, radius));
        walls = walls.concat(this.makeEastExitWall(room, radius));
        return walls;
    }

    static makeNorthExitWall(room: Room, radius: number): { x: number, y: number }[] {
        let inExit = false;
        let walls: { x: number, y: number }[] = [];

        for (var x = 0; x < 50; x++) {
            let lookWall = room.lookForAt(LOOK_TERRAIN, x, 0);
            if (lookWall.length && lookWall[0] != "wall") {
                if (inExit) {
                    walls.push({ x: x, y: radius });
                } else {
                    inExit = true;
                    for (var i = 0; i < radius && x - i >= 0; i++)
                        walls.push({ x: x - i, y: radius })

                    if (x - radius >= 0)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: x - radius, y: i });
                }
            } else {
                if (inExit) {
                    inExit = false;
                    for (var i = 0; i < radius && x + i < 49; i++)
                        walls.push({ x: x + i, y: radius });

                    if (x + radius <= 49)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: x + radius, y: i });
                }
            }
        }

        return walls;
    }

    static makeSouthExitWall(room: Room, radius: number): { x: number, y: number }[] {
        let inExit = false;
        let walls: { x: number, y: number }[] = [];

        for (var x = 0; x < 50; x++) {
            let lookWall = room.lookForAt(LOOK_TERRAIN, x, 49);
            if (lookWall.length && lookWall[0] != "wall") {
                if (inExit) {
                    walls.push({ x: x, y: 49 - radius });
                } else {
                    inExit = true;
                    for (var i = 0; i < radius && x - i >= 0; i++)
                        walls.push({ x: x - i, y: 49 - radius })

                    if (x - radius >= 0)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: x - radius, y: 49 - i });
                }
            } else {
                if (inExit) {
                    inExit = false;
                    for (var i = 0; i < radius && x + i < 49; i++)
                        walls.push({ x: x + i, y: 49 - radius });

                    if (x + radius <= 49)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: x + radius, y: 49 - i });
                }
            }
        }

        return walls;
    }

    static makeWestExitWall(room: Room, radius: number): { x: number, y: number }[] {
        let inExit = false;
        let walls: { x: number, y: number }[] = [];

        for (var y = 0; y < 49; y++) {
            let lookWall = room.lookForAt(LOOK_TERRAIN, 0, y);
            if (lookWall.length && lookWall[0] != "wall") {
                if (inExit) {
                    walls.push({ x: radius, y: y });
                } else {
                    inExit = true;
                    for (var i = 0; i < radius && y - i >= 0; i++)
                        walls.push({ x: radius, y: y - i })

                    if (y - radius >= 0)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: i, y: y - radius });
                }
            } else {
                if (inExit) {
                    inExit = false;
                    for (var i = 0; i < radius && y + i < 49; i++)
                        walls.push({ x: radius, y: y + i });

                    if (y + radius <= 49)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: i, y: y + radius });
                }
            }
        }

        return walls;
    }

    static makeEastExitWall(room: Room, radius: number): { x: number, y: number }[] {
        let inExit = false;
        let walls: { x: number, y: number }[] = [];

        for (var y = 0; y < 49; y++) {
            let lookWall = room.lookForAt(LOOK_TERRAIN, 49, y);
            if (lookWall.length && lookWall[0] != "wall") {
                if (inExit) {
                    walls.push({ x: 49 - radius, y: y });
                } else {
                    inExit = true;
                    for (var i = 0; i < radius && y - i >= 0; i++)
                        walls.push({ x: 49 - radius, y: y - i })

                    if (y - radius >= 0)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: 49 - i, y: y - radius });
                }
            } else {
                if (inExit) {
                    inExit = false;
                    for (var i = 0; i < radius && y + i < 49; i++)
                        walls.push({ x: 49 - radius, y: y + i });

                    if (y + radius <= 49)
                        for (var i = 0; i <= radius; i++)
                            walls.push({ x: 49 - i, y: y + radius });
                }
            }
        }

        return walls;
    }
}
