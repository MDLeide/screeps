import { Spawner } from "./Spawner";
import { Body } from "./Body";

export class CreepNamer {
    public static setCustomNamingMethod(delegate: (body: Body, spawner: Spawner) => string) {
        this.delegate = delegate;
    }

    public static getCreepName(body: Body, spawner: Spawner): string {
        if (this.delegate)
            return this.delegate(body, spawner);

        var timeString = Game.time.toString();
        var time = timeString.slice(timeString.length - 4);
        return body.name + "-" + spawner.spawn.name + "-" + time;
    }

    private static delegate: (body: Body, spawner: Spawner) => string;
}
