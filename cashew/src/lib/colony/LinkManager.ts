import { Colony } from "./Colony";

export class LinkManager {
    public execute(colony: Colony): void {
        if (colony.resourceManager.structures.sourceALink)
            this.runLink(colony.resourceManager.structures.sourceALink, colony);

        if (colony.resourceManager.structures.sourceBLink)
            this.runLink(colony.resourceManager.structures.sourceBLink, colony);
    }

    private runLink(link: StructureLink, colony: Colony): void {
        if (link.cooldown == 0 && link.energy >= 600) {
            let target = colony.resourceManager.getLinkTransferTarget();
            if (target) {
                link.transferEnergy(target);
                colony.resourceManager.ledger.registerLinkTransferCost(
                    Math.min(link.energy, target.energyCapacity - target.energy) * .03);
            }
        }
    }
}
