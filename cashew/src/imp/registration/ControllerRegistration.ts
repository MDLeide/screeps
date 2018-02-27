import { CreepControllerRepository } from "../../lib/creep/CreepControllerRepository";
import { BuilderJob, BuildJobMemory } from "../creep/BuilderJob";
import { HarvesterController, HarvesterControllerMemory } from "../creep/HarvesterController";
import { HarvestInfrastructureBuilderController, HarvestInfrastructureBuilderControllerMemory } from "../creep/HarvestInfrastructureBuilderController";
import { HaulerRole } from "../creep/HaulerRole";
import { LightUpgraderRole } from "../creep/LightUpgraderRole";
import { UpgraderRole, UpgraderRoleMemory } from "../creep/UpgraderRole";


export class ControllerRegistration {
    public static register(): void {
        CreepControllerRepository.register(
            CREEP_CONTROLLER_HARVESTER,
            (mem: HarvesterControllerMemory) => HarvesterController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_BUILDER,
            (mem: BuildJobMemory) => BuilderJob.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER,
            (mem: HarvestInfrastructureBuilderControllerMemory) => HarvestInfrastructureBuilderController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_HAULER,
            (mem: RoleMemory) => HaulerRole.fromMemory(mem, new HaulerRole()));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_LIGHT_UPGRADER,
            (mem: RoleMemory) => LightUpgraderRole.fromMemory(mem, new LightUpgraderRole()));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_UPGRADER,
            (mem: UpgraderRoleMemory) => UpgraderRole.fromMemory(mem));
    }
}
