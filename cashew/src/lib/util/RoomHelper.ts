export class RoomHelper {
    public static isCenterRoom(roomName: string): boolean {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let xRemainder = Number(parsed[1]) % 10;
        let yRemainder = Number(parsed[2]) % 10;

        return xRemainder == 5 && yRemainder == 5;
    }

    public static isSourceKeeperRoom(roomName: string): boolean {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let xRemainder = Number(parsed[1]) % 10;
        let yRemainder = Number(parsed[2]) % 10;

        if (xRemainder == 5 && yRemainder == 5)
            return false;

        return (xRemainder == 4 || xRemainder == 5 || xRemainder == 6) &&
            (yRemainder == 4 || yRemainder == 5 || yRemainder == 6);
    }

    public static isHighway(roomName: string): boolean {
        let coords = this.getRoomCoordinatesFromName(roomName);
        return (coords.x - 1) % 10 == 0 || (coords.y - 1) % 10 == 0;
    }

    /**
     * @param roomName
     * @param direction 0 - North, 1 - NorthEast, 2 - East,... 7 - NorthWest
     */
    public static getAdjacentRoom(roomName: string, direction: number): string {
        let roomCoords = this.getRoomCoordinatesFromName(roomName);

        switch (direction) {
            case 0:
                roomCoords.y += 1;
                if (roomCoords.y == 0)
                    roomCoords.y += 1;
                break;

            case 1:
                roomCoords.y += 1;
                if (roomCoords.y == 0)
                    roomCoords.y += 1;
                roomCoords.x += 1;
                if (roomCoords.x == 0)
                    roomCoords.x += 1;
                break;

            case 2:
                roomCoords.x += 1;
                if (roomCoords.x == 0)
                    roomCoords.x += 1;
                break;

            case 3:
                roomCoords.x += 1;
                if (roomCoords.x == 0)
                    roomCoords.x += 1;
                roomCoords.y -= 1;
                if (roomCoords.y == 0)
                    roomCoords.y -= 1;
                break;

            case 4:
                roomCoords.y -= 1;
                if (roomCoords.y == 0)
                    roomCoords.y -= 1;
                break;

            case 5:
                roomCoords.x -= 1;
                if (roomCoords.x == 0)
                    roomCoords.x -= 1;
                roomCoords.y -= 1;
                if (roomCoords.y == 0)
                    roomCoords.y -= 1;
                break;

            case 6:
                roomCoords.x -= 1;
                if (roomCoords.x == 0)
                    roomCoords.x -= 1;
                break;

            case 7:
                roomCoords.x -= 1;
                if (roomCoords.x == 0)
                    roomCoords.x -= 1;
                roomCoords.y += 1;
                if (roomCoords.y == 0)
                    roomCoords.y += 1;
                break;

            default:
                throw Error("argument out of range");
        }

        return this.getRoomNameFromCoordinates(roomCoords);
    }

    /** Gets the the room coordinates for the room name. Room coordinates start at 1 or -1, there is no 0 for the x or y axis. */
    public static getRoomCoordinatesFromName(roomName: string): { x: number, y: number } {
        let xSign: string = roomName[0];
        let x: number;
        let ySign: string;
        let y: number;
        
        if (isNaN(parseInt(roomName[2]))) { //W1N2
            ySign = roomName[2];
            x = Number(roomName[1]) + 1;
            y = Number(roomName.substring(3)) + 1;
        } else { //W23S3
            ySign = roomName[3];
            x = Number(roomName.substring(1, 2)) + 1; 
            y = Number(roomName.substring(4)) + 1;
        }

        if (xSign == "W")
            x = -x;
        if (ySign == "S")
            y = -y;

        return { x: x, y: y };
    }

    /** Gets the name of a room located at the room coordinates provided. Room coordinates start at 1 or -1, there is no 0 for the x or y axis. */
    public static getRoomNameFromCoordinates(coords: { x: number, y: number }): string {
        let xAxis: string = coords.x > 0 ? "E" : "W";
        let yAxis: string = coords.y > 0 ? "N" : "S";

        return xAxis + (Math.abs(coords.x) - 1) + yAxis + (Math.abs(coords.y) - 1);
    }
        
    public static getRoomOffset(originRoomName: string, destRoomName: string): { x: number, y: number } {
        let origin = this.getRoomCoordinatesFromName(originRoomName);
        let dest = this.getRoomCoordinatesFromName(destRoomName);

        let originXPos = origin.x > 0;
        let originYPos = origin.y > 0;
        let destXPos = dest.x > 0;
        let destYPos = dest.y > 0;

        let offset = { x: dest.x - origin.x, y: dest.y - origin.y };

        if (originXPos == destXPos && destXPos == destYPos) // same quadrant
            return offset;        

        if (!destXPos && originXPos) // crossing west
            offset.x += 1;
        else if (destXPos && !originXPos) // crossing east
            offset.x -= 1;
        
        if (!destYPos && originYPos) // crossing south
            offset.y += 1;
        else if (destYPos && !originYPos) // crossing north
            offset.y -= 1;

        return offset;
    }

    public static moveRoom(roomName: string, direction: DirectionConstant, distance: number = 1): string {
        switch (direction) {
            case TOP:
                return this.transformRoom(roomName, { x: 0, y: distance });
            case TOP_RIGHT:
                return this.transformRoom(roomName, { x: distance, y: distance });
            case RIGHT:
                return this.transformRoom(roomName, { x: distance, y: 0 });
            case BOTTOM_RIGHT:
                return this.transformRoom(roomName, { x: distance, y: -distance });
            case BOTTOM:
                return this.transformRoom(roomName, { x: 0, y: -distance });
            case BOTTOM_LEFT:
                return this.transformRoom(roomName, { x: -distance, y: -distance });
            case LEFT:
                return this.transformRoom(roomName, { x: -distance, y: 0 });
            case TOP_LEFT:
                return this.transformRoom(roomName, { x: -distance, y: distance });
        }
    }

    /** Gets the name of the room located at the offset from roomName. */
    public static transformRoom(roomName: string, offset: { x: number, y: number }): string {
        let origin = this.getRoomCoordinatesFromName(roomName);
        let transform = { x: origin.x + offset.x, y: origin.y + offset.y };

        if (origin.x > 0 && transform.x <= 0)
            transform.x--;
        else if (origin.x < 0 && transform.x >= 0)
            transform.x++;
        if (origin.y > 0 && transform.y <= 0)
            transform.y--;
        else if (origin.y < 0 && transform.y >= 0)
            transform.y++;

        return this.getRoomNameFromCoordinates(transform);
    }


    public static getRoomPositionOffset(origin: RoomPosition, dest: RoomPosition): { x: number, y: number } {        
        if (origin.roomName == dest.roomName)
            return { x: dest.x - origin.x, y: dest.y - origin.y };

        let roomOffset = this.getRoomOffset(origin.roomName, dest.roomName);
        let offset = { x: 0, y: 0 };

        if (roomOffset.x > 0)
            offset.x = dest.x + (50 - origin.x) + (roomOffset.x - 1) * 50;
        else if (roomOffset.x < 0)
            offset.x = -((50 - dest.x) + origin.x + (roomOffset.x - 1) * 50);
        else
            offset.x = dest.x - origin.x;

        if (roomOffset.y > 0)
            offset.y = dest.y + (50 - origin.y) + (roomOffset.y - 1) * 50;
        else if (roomOffset.y < 0)
            offset.y = -((50 - dest.y) + origin.y + (roomOffset.y - 1) - 50);
        else
            offset.y = dest.y - origin.y;

        return offset;
    }

    public static moveRoomPosition(pos: RoomPosition, direction: DirectionConstant, distance: number = 1): RoomPosition {
        switch (direction) {
            case TOP:
                return this.transformRoomPosition(pos, { x: 0, y: distance });
            case TOP_RIGHT:
                return this.transformRoomPosition(pos, { x: distance, y: distance });
            case RIGHT:
                return this.transformRoomPosition(pos, { x: distance, y: 0 });
            case BOTTOM_RIGHT:
                return this.transformRoomPosition(pos, { x: distance, y: -distance });
            case BOTTOM:
                return this.transformRoomPosition(pos, { x: 0, y: -distance });
            case BOTTOM_LEFT:
                return this.transformRoomPosition(pos, { x: -distance, y: -distance });
            case LEFT:
                return this.transformRoomPosition(pos, { x: -distance, y: 0 });
            case TOP_LEFT:
                return this.transformRoomPosition(pos, { x: -distance, y: distance });
        }
    }

    public static transformRoomPosition(pos: RoomPosition, offset: { x: number, y: number }): RoomPosition {
        let newPos = { x: pos.x + offset.x, y: pos.y + offset.y };
        let roomOffset = { x: 0, y: 0 };

        if (newPos.x > 49) {
            roomOffset.x = Math.floor(newPos.x / 50);
            newPos.x = newPos.x % 50;
        } else if (newPos.x < 0) {
            roomOffset.x = Math.floor(newPos.x / 50);
            newPos.x = 50 + (newPos.x % 50);
        }

        if (newPos.y > 49) {
            roomOffset.y = Math.floor(newPos.y / 50);
            newPos.y = newPos.y % 50;
        } else if (newPos.y < 0) {
            roomOffset.y = Math.floor(newPos.y / 50);
            newPos.y = 50 + (newPos.y % 50);
        }

        let room = pos.roomName;
        if (roomOffset.x != 0 || roomOffset.y != 0)
            room = this.transformRoom(room, roomOffset);

        return new RoomPosition(newPos.x, newPos.y, room);
    }    

    public static isWalkable(pos: RoomPosition, ignoreCreeps: boolean = true): boolean {
        let lookTerrain = pos.lookFor(LOOK_TERRAIN);
        for (var i = 0; i < lookTerrain.length; i++)
            if (_.any(OBSTACLE_OBJECT_TYPES, (p) => p == lookTerrain[i]))
                return false;

        let lookStructures = pos.lookFor(LOOK_STRUCTURES);
        for (var i = 0; i < lookStructures.length; i++)
            if (_.any(OBSTACLE_OBJECT_TYPES, (p) => p == lookStructures[i].structureType))
                return false;

        if (!ignoreCreeps) {
            let lookCreeps = pos.lookFor(LOOK_CREEPS);
            if (lookCreeps.length)
                return false;
        }
        return true;
    }

    /** Converts a room position to a global position. */
    public static getGlobalPosition(pos: RoomPosition): { x: number, y: number } {
        let roomCoords = this.getRoomCoordinatesFromName(pos.roomName);
        let p: { x: number, y: number } = { x: 0, y: 0 };
        if (roomCoords.x < 0)
            p.x = 50 * (roomCoords.x + 1) - pos.x - 1;
        else
            p.x = 50 * (roomCoords.x - 1) + pos.x + 1;

        if (roomCoords.y < 0)
            p.y = 50 * (roomCoords.y + 1) - pos.y - 1;
        else
            p.y = 50 * (roomCoords.y - 1) + pos.y + 1;

        return p;
    }

    public static getRoomPositionFromGlobalPosition(pos: { x: number, y: number }): RoomPosition {        
        let roomX = Math.floor(Math.abs(pos.x) / 50)
        let roomY = Math.floor(Math.abs(pos.y) / 50);
        let x = pos.x % 50;
        let y = pos.y % 50;

        if (pos.x < 0) {
            roomX = -roomX;
            roomX -= 1;
            x += 1;
        }
        else {
            roomX += 1;
            x -= 1;
        }

        if (pos.y < 0) {
            roomY = -roomY;
            roomY -= 1;
            y += 1;
        } else {
            roomY += 1;
            y -= 1;
        }
        
        let name = this.getRoomNameFromCoordinates({ x: roomX, y: roomY });
        return new RoomPosition(x, y, name);
    }

    /** Calculates the average position from an array of room positions. */
    public static getAveragePosition(positions: RoomPosition[]): RoomPosition {
        let globals: { x: number, y: number }[] = [];
        for (var i = 0; i < positions.length; i++)
            globals.push(this.getGlobalPosition(positions[i]));

        let x = 0;
        let y = 0;
        let count = 0;

        for (var i = 0; i < globals.length; i++) {
            x += globals[i].x;
            y += globals[i].y;
            count++;
        }

        x = Math.floor(x / count);
        y = Math.floor(y / count);
        return this.getRoomPositionFromGlobalPosition({ x: x, y: y });
    }
}
