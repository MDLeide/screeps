//export class Population {
//    constructor(spawn: StructureSpawn) {
//        this.spawn = spawn;
//    }

//    public spawn: StructureSpawn;

//    public popByRole(): { [roleId: string]: number } {
//        var count: { [roleId: string]: number } = {}
//        for (var name in Game.creeps) {
//            var creep = Game.creeps[name];
//            if (creep.spawning) {
//                continue;
//            }

//            if (creep.nut.home.id != this.spawn.id) {
//                continue;
//            }

//            if (!count[creep.nut.role.id]) {
//                count[creep.nut.role.id] = 0;
//            }
//            count[creep.nut.role.id]++;
//        }        
//        return count;
//    }

//    public countAll(): number {
//        return this.count((creep) => { return true; });
//    }

//    public countByRole(roleId: string): number {
//        return this.count((creep) => { return creep.nut.role.id == roleId; });
//    }

//    public count(match: (creep: Creep) => boolean) {
//        var count = 0;
//        for (var name in Game.creeps) {
//            var creep = Game.creeps[name];
//            if (creep.spawning) {
//                continue;
//            }

//            if (creep.nut.home.id != this.spawn.id) {
//                continue;
//            }

//            if (match(creep)) {
//                count++;
//            }
//        }
//        return count;
//    }
//}
