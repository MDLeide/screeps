import { CreepControllerRepository } from "../../lib/creep/CreepControllerRepository";
import { BuilderJob, BuildJobMemory } from "../creep/BuilderJob";
import { HarvesterController, HarvesterControllerMemory } from "../creep/HarvesterController";
import { HarvestInfrastructureBuilderController, HarvestInfrastructureBuilderControllerMemory } from "../creep/HarvestInfrastructureBuilderController";
import { HaulerRole } from "../creep/HaulerRole";
import { LightUpgraderRole } from "../creep/LightUpgraderRole";
import { UpgraderController, UpgraderRoleMemory } from "../creep/UpgraderController";
import { RemoteHarvesterController, RemoteHarvesterControllerMemory  } from "../creep/RemoteHarvesterController";
import { RemoteHaulerRole, RemoteHaulerRoleMemory } from "../creep/RemoteHaulerRole";
import { ChemistController } from "../creep/ChemistController";
import { FillerController } from "../creep/FillerController";
import { MasonController } from "../creep/MasonController";
import { ExtractorController } from "../creep/ExtractorController";


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
            (mem: UpgraderRoleMemory) => UpgraderController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_REMOTE_HARVESTER,
            (mem: RemoteHarvesterControllerMemory) => RemoteHarvesterController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_REMOTE_HAULER,
            (mem: RemoteHaulerRoleMemory) => RemoteHaulerRole.fromMemory(mem));
        
        CreepControllerRepository.register(
            CREEP_CONTROLLER_EXTRACTOR,
            (mem: RemoteHaulerRoleMemory) => ExtractorController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_CHEMIST,
            (mem: RemoteHaulerRoleMemory) => ChemistController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_FILLER,
            (mem: RemoteHaulerRoleMemory) => FillerController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_MASON,
            (mem: RemoteHaulerRoleMemory) => MasonController.fromMemory(mem));
    }
}
