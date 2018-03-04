import { Colony } from "./Colony";

export class LinkManager {
    public execute(colony: Colony): void {
        if (colony.resourceManager.structures.sourceAContainerOrLink instanceof StructureLink)
            this.runLink(colony.resourceManager.structures.sourceAContainerOrLink, colony);

        if (colony.resourceManager.structures.sourceBContainerOrLink instanceof StructureLink)
            this.runLink(colony.resourceManager.structures.sourceBContainerOrLink, colony);
    }

    private runLink(link: StructureLink, colony: Colony): void {
        if (link.cooldown == 0 && link.energy >= 600) {
            let target = colony.resourceManager.getLinkTransferTarget();
            if (target) {
                link.transferEnergy(target);
            }
        }
    }
}
