import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";
import { Nest } from "./Nest";

export class CreepNamer {
    public static setCustomNamingMethod(delegate: (body: Body, spawnerOrNest: Spawner | Nest) => string) {
        this.delegate = delegate;
    }

    public static getCreepName(body: Body, spawnerOrNest: Spawner | Nest): string {
        if (this.delegate)
            return this.delegate(body, spawnerOrNest);

        var timeString = Game.time.toString();
        var time = timeString.slice(timeString.length - 4);
        let name = spawnerOrNest instanceof Spawner ? spawnerOrNest.spawn.name : spawnerOrNest.roomName;
        return body.type + "-" + name + "-" + time;
    }

    private static delegate: (body: Body, spawnerOrNest: Spawner | Nest) => string;
}
