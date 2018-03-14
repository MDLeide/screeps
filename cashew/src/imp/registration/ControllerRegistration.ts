import { CreepControllerRepository } from "../../lib/creep/CreepControllerRepository";

import { FillerController, FillerControllerMemory } from "../creep/FillerController";
import { HarvesterController, HarvesterControllerMemory } from "../creep/HarvesterController";
import { HaulerRole } from "../creep/HaulerRole";
import { LightUpgraderRole } from "../creep/LightUpgraderRole";
import { RemoteHarvesterController, RemoteHarvesterControllerMemory } from "../creep/RemoteHarvesterController";
import { RemoteHaulerRole, RemoteHaulerRoleMemory } from "../creep/RemoteHaulerRole";
import { UpgraderController, UpgraderRoleMemory } from "../creep/UpgraderController";
import { ChemistController } from "../creep/ChemistController";
import { ExtractorController } from "../creep/ExtractorController";

import { HarvestInfrastructureBuilderController, HarvestInfrastructureBuilderControllerMemory } from "../creep/HarvestInfrastructureBuilderController";
import { MasonController, MasonControllerMemory } from "../creep/MasonController";
import { BuilderJob, BuildJobMemory } from "../creep/BuilderJob";

import { DefenderController } from "../creep/DefenderController";
import { ScoutJob, ScoutJobMemory } from "../creep/ScoutJob";
import { ReserveJob, ReserveJobMemory } from "../creep/ReserveJob";


export class ControllerRegistration {
    public static register(): void {
        CreepControllerRepository.register(
            CREEP_CONTROLLER_SCOUT,
            (mem: ScoutJobMemory) => ScoutJob.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_RESERVE,
            (mem: ReserveJobMemory) => ReserveJob.fromMemory(mem));

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
            (mem: CreepControllerMemory) => ExtractorController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_CHEMIST,
            (mem: CreepControllerMemory) => ChemistController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_FILLER,
            (mem: FillerControllerMemory) => FillerController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_MASON,
            (mem: MasonControllerMemory) => MasonController.fromMemory(mem));

        CreepControllerRepository.register(
            CREEP_CONTROLLER_DEFENDER,
            (mem: CreepControllerMemory) => DefenderController.fromMemory(mem));
    }
}
