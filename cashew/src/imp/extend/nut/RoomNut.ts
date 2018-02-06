import { RoomSeed } from '../Seed/RoomSeed';
import { StatefulNut } from '../../../lib/extend/StatefulNut';

export class RoomNut extends StatefulNut<Room, RoomSeed, RoomMemory> {
    constructor(seed: RoomSeed, state: RoomMemory) {
        super(seed, state);
    }
}





