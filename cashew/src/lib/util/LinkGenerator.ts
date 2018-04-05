export class LinkGenerator {
    /** Creates an HTML link to the room. */
    public static linkRoom(room: string | Room, innerText?: string): string {
        if (room instanceof Room)
            return this.linkRoom(room.name);
        return `<a href="#!/room/${Game.shard.name}/${room}">${innerText ? innerText : room}</a>`;
    }
}
