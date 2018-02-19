import { RoleRepo } from "../../lib/creep/role/RoleRepo";

import { HeavyHarvester } from "../creep/role/HeavyHarvester";
import { LightUpgrader } from "../creep/role/LightUpgrader";
import { HeavyUpgrader } from "../creep/role/HeavyUpgrader";
import { LightMiner } from "../creep/role/LightMiner";
import { Transporter } from "../creep/role/Transporter";
import { Builder } from "../creep/role/Builder";
import { Waller } from "../creep/role/Waller";
import { Warrior } from "../creep/role/Warrior";
import { Cobbler } from "../creep/role/Cobbler";
import { Cleaner } from "../creep/role/Cleaner";

export class RoleRegistration {
    public static register(): void {
        RoleRegistration.registerRoles();
        RoleRegistration.registerNewRoles();
    }

    private static registerRoles(): void {
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
    
    private static registerNewRoles(): void {
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
}
