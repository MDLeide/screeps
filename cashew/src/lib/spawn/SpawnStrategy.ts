import { Egg } from "./Egg";
import { SpawnCondition } from "./SpawnCondition";

/**
 * We'll use spawn conditions to keep track of what needs to spawn. Each time
we're asked for an egg, we'll iterate through the entire list. We assume the list
is ordered by priority. Each time we encounter a role in the condition list, we increment
a counter by one, indicating an additional requirement for that role. If the population meets
or exceeds this number, we move on to the next.

If we don't have the required energy, we return null until we do.
 */

export abstract class SpawnStrategy {
    private spawnConditions: SpawnCondition[];
    private debug: boolean = false;

    constructor() {
        this.spawnConditions = [];
    }

    public getNextEgg(spawn: StructureSpawn): Egg | null {
        var pop = spawn.nut.population.popByRole();
        var count: { [roleId: string] : number } = {};
        var energy = spawn.nut.totalEnergyAvailable();

        for (var i = 0; i < this.spawnConditions.length; i++) {
            var cond = this.spawnConditions[i];

            if (this.debug)
                console.log("evaluating " + cond.roleId)

            if (!count[cond.roleId]) {
                count[cond.roleId] = 0;
            }
            count[cond.roleId]++;

            if (this.debug) {
                console.log("population: " + pop[cond.roleId]);
                console.log("count: " + count[cond.roleId]);
            }
            

            if (pop[cond.roleId] && pop[cond.roleId] >= count[cond.roleId]) {
                if (this.debug)
                    console.log("population met");

                continue;
            }

            if (this.debug)
                console.log("energy: " + energy.toString() + "  | required: " + cond.minimumEnergy.toString());

            if (energy < cond.minimumEnergy) {
                if (this.debug)
                    console.log("not enough energy");

                return null;
            }

            var egg = cond.getEgg(spawn);            
            var time = Game.time.toString();
            var truncTime = time.slice(time.length - 4);
            egg.name = "C" + truncTime;
            return egg;
        }

        return null;
    }

    protected addCondition(condition: SpawnCondition) {
        this.spawnConditions.push(condition);
    }

}
