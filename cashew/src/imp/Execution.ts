import { Spawner } from "../lib/spawn/Spawner";
import { StrategyFactory } from "./spawn/StrategyFactory";
import { Extender } from "./extend/Extender";
import { RoleRepo } from "../lib/creep/role/RoleRepo";
import { ActivityRepo } from "../lib/creep/activity/ActivityRepo";

import { TowerController } from "./tower/TowerController";

import { IHeavyHarvesterState } from "./creep/role/state/IHeavyHarvesterState";

import { HeavyHarvester } from "./creep/role/HeavyHarvester";
import { LightUpgrader } from "./creep/role/LightUpgrader";
import { HeavyUpgrader } from "./creep/role/HeavyUpgrader";
import { LightMiner } from "./creep/role/LightMiner";
import { Transporter } from "./creep/role/Transporter";
import { Builder } from "./creep/role/Builder";
import { Waller } from "./creep/role/Waller";
import { Warrior } from "./creep/role/Warrior";
import { Cobbler } from "./creep/role/Cobbler";
import { Cleaner } from "./creep/role/Cleaner";


import { BuildingStructure } from "./creep/activity/BuildingStructure";
import { ChargingTower } from "./creep/activity/ChargingTower";
import { MiningEnergy } from "./creep/activity/MiningEnergy";
import { SupplyingController } from "./creep/activity/SupplyingController";
import { SupplyingSpawn } from "./creep/activity/SupplyingSpawn";
import { UpgradingController } from "./creep/activity/UpgradingController";
import { UpgradeWithdrawingEnergy } from "./creep/activity/UpgradeWithdrawingEnergy";
import { WithdrawingEnergy } from "./creep/activity/WithdrawingEnergy";
import { AttackingNearestEnemy } from "./creep/activity/AttackingNearestEnemy";
import { PickingEnergy } from "./creep/activity/PickingEnergy";
import { RepairingWalls } from "./creep/activity/RepairingWalls";
import { RepairingRoads } from "./creep/activity/RepairingRoads";
import { RepairingStructures } from "./creep/activity/RepairingStructures";

import { SilentEmptyActivity } from "../lib/creep/activity/SilentEmptyActivity";
import { EmptyActivity } from "../lib/creep/activity/EmptyActivity";

//todo: split registrations to their own files

export class Execute {
    private spawner: Spawner;
    private stratFactory: StrategyFactory;

    public init(): void {
        console.log("Execution initializing.");
        this.extendProtos();

        this.stratFactory = new StrategyFactory();
        this.spawner = new Spawner(this.stratFactory.getStrategy);
        
        this.registerActivities();
        this.registerRoles();
        this.registerNewRoles();
        console.log("Execution done initializing.");
    }

    public main(): void {
        this.cleanupCreeps();
        this.spawner.spawn();

        for (var spawn in Game.spawns) {
            var towers = Game.spawns[spawn].room.find<StructureTower>(
                FIND_MY_STRUCTURES,
                {
                    filter: (struct: Structure) => { return struct.structureType == STRUCTURE_TOWER; }
                });
            for (var i = 0; i < towers.length; i++) {
                if (!towers[i].controller)
                    towers[i].controller = new TowerController(towers[i]);
                towers[i].controller.execute();
            }
        }

        for (var name in Game.creeps) {
            if (Game.creeps[name].spawning) {
                continue;
            }
            Game.creeps[name].nut.role.execute();
        }
    }
    
    private registerRoles(): void {
        RoleRepo.RegisterRole(Transporter.id, (state) => {
            var instance = Object.create(Transporter.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(HeavyHarvester.id, (state) => {
            var instance = Object.create(HeavyHarvester.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(LightUpgrader.id, (state) => {
            var instance = Object.create(LightUpgrader.prototype);
            instance.state = state;
            return instance;

        });
        RoleRepo.RegisterRole(HeavyUpgrader.id, (state) => {
            var instance = Object.create(HeavyUpgrader.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(LightMiner.id, (state) => {
            var instance = Object.create(LightMiner.prototype);
            instance.state = state;
            return instance;
        });
        
        RoleRepo.RegisterRole(Builder.id, (state) => {
            var instance = Object.create(Builder.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(Warrior.id, (state) => {
            var instance = Object.create(Warrior.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(Waller.id, (state) => {
            var instance = Object.create(Waller.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(Cobbler.id, (state) => {
            var instance = Object.create(Cobbler.prototype);
            instance.state = state;
            return instance;
        });

        RoleRepo.RegisterRole(Cleaner.id, (state) => {
            var instance = Object.create(Cleaner.prototype);
            instance.state = state;
            return instance;
        });

    }
    
        
    private registerNewRoles(): void {
        RoleRepo.RegisterRoleNew(Transporter.id, (creep) => {
            return new Transporter(creep);
        });

        RoleRepo.RegisterRoleNew(HeavyHarvester.id, (creep) => {
            return new HeavyHarvester(creep);
        });

        RoleRepo.RegisterRoleNew(Cobbler.id, (creep) => {
            return new Cobbler(creep);
        });

        RoleRepo.RegisterRoleNew(LightUpgrader.id, (creep) => {
            return new LightUpgrader(creep);
        });

        RoleRepo.RegisterRoleNew(HeavyUpgrader.id, (creep) => {
            return new HeavyUpgrader(creep);
        });

        RoleRepo.RegisterRoleNew(LightMiner.id, (creep) => {
            return new LightMiner(creep);
        });

        RoleRepo.RegisterRoleNew(Builder.id, (creep) => {
            return new Builder(creep);
        });

        RoleRepo.RegisterRoleNew(Warrior.id, (creep) => {
            return new Warrior(creep);
        });

        RoleRepo.RegisterRoleNew(Waller.id, (creep) => {
            return new Waller(creep);
        });

        RoleRepo.RegisterRoleNew(Cleaner.id, (creep) => {
            return new Cleaner(creep);
        });

        
    }
        
    private registerActivities(): void {
        ActivityRepo.RegisterActivity(EmptyActivity.id, (state) => {
            var instance = Object.create(EmptyActivity.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(SilentEmptyActivity.id, (state) => {
            var instance = Object.create(SilentEmptyActivity.prototype);
            instance.state = state;
            return instance;
        });


        ActivityRepo.RegisterActivity(RepairingWalls.id, (state) => {
            var instance = Object.create(RepairingWalls.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(BuildingStructure.id, (state) => {
            var instance = Object.create(BuildingStructure.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(ChargingTower.id, (state) => {
            var instance = Object.create(ChargingTower.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(MiningEnergy.id, (state) => {
            var instance = Object.create(MiningEnergy.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(SupplyingController.id, (state) => {
            var instance = Object.create(SupplyingController.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(SupplyingSpawn.id, (state) => {
            var instance = Object.create(SupplyingSpawn.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(UpgradingController.id, (state) => {
            var instance = Object.create(UpgradingController.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(WithdrawingEnergy.id, (state) => {
            var instance = Object.create(WithdrawingEnergy.prototype);
            instance.state = state;
            return instance;
        });
                
        ActivityRepo.RegisterActivity(UpgradeWithdrawingEnergy.id, (state) => {
            var instance = Object.create(UpgradeWithdrawingEnergy.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(AttackingNearestEnemy.id, (state) => {
            var instance = Object.create(AttackingNearestEnemy.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(PickingEnergy.id, (state) => {
            var instance = Object.create(PickingEnergy.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(RepairingRoads.id, (state) => {
            var instance = Object.create(RepairingRoads.prototype);
            instance.state = state;
            return instance;
        });

        ActivityRepo.RegisterActivity(RepairingStructures.id, (state) => {
            var instance = Object.create(RepairingStructures.prototype);
            instance.state = state;
            return instance;
        });
        
    }    

    private extendProtos(): void {
        Extender.extend();
    }

    private cleanupCreeps(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            } else if (Game.creeps[name].ticksToLive == 1) { //todo: need better method, misses lots of cases
                Game.creeps[name].nut.role.onDeath();
            }
        }
    }

  private 
}
