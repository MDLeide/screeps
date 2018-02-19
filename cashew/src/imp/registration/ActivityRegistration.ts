import { ActivityRepo } from "../../lib/creep/activity/ActivityRepo";

import { BuildingStructure } from "../creep/activity/BuildingStructure";
import { ChargingTower } from "../creep/activity/ChargingTower";
import { MiningEnergy } from "../creep/activity/MiningEnergy";
import { SupplyingController } from "../creep/activity/SupplyingController";
import { SupplyingSpawn } from "../creep/activity/SupplyingSpawn";
import { UpgradingController } from "../creep/activity/UpgradingController";
import { UpgradeWithdrawingEnergy } from "../creep/activity/UpgradeWithdrawingEnergy";
import { WithdrawingEnergy } from "../creep/activity/WithdrawingEnergy";
import { AttackingNearestEnemy } from "../creep/activity/AttackingNearestEnemy";
import { PickingEnergy } from "../creep/activity/PickingEnergy";
import { RepairingWalls } from "../creep/activity/RepairingWalls";
import { RepairingRoads } from "../creep/activity/RepairingRoads";
import { RepairingStructures } from "../creep/activity/RepairingStructures";
import { SupplyingStorage } from "../creep/activity/SupplyingStorage";

import { SilentEmptyActivity } from "../../lib/creep/activity/SilentEmptyActivity";
import { EmptyActivity } from "../../lib/creep/activity/EmptyActivity";

export class ActivityRegistration {
    public static register(): void {
        ActivityRegistration.registerActivities();
    }

    private static registerActivities(): void {
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


        ActivityRepo.RegisterActivity(SupplyingStorage.id, (state) => {
            var instance = Object.create(SupplyingStorage.prototype);
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
}
