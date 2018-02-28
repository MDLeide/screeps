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
        let coords = this.convertNameToCoordinates(roomName);
        return (coords.x - 1) % 10 == 0 || (coords.y - 1) % 10 == 0;
    }

    /**
     * @param roomName
     * @param direction 0 - North, 1 - NorthEast, 2 - East,... 7 - NorthWest
     */
    public static getAdjacentRoom(roomName: string, direction: number): string {
        let roomCoords = this.convertNameToCoordinates(roomName);

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

        return this.convertCoordinatesToName(roomCoords);
    }

    public static convertNameToCoordinates(roomName: string): { x: number, y: number } {
        let xSign: string = roomName[0];
        let x: number;
        let ySign: string;
        let y: number;

        if (isNaN(Number(roomName[2]))) { //W1N2
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

    public static convertCoordinatesToName(coords: { x: number, y: number }): string {
        let xAxis: string = coords.x > 0 ? "E" : "W";
        let yAxis: string = coords.y > 0 ? "N" : "S";

        return xAxis + (Math.abs(coords.x) - 1) + yAxis + (Math.abs(coords.y) - 1);
    }
}
