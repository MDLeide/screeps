import { Colony } from "./Colony";

export class LinkManager {
    public execute(colony: Colony): void {
        if (colony.resourceManager.sourceAContainerOrLink instanceof StructureLink)
            this.runLink(colony.resourceManager.sourceAContainerOrLink, colony);

        if (colony.resourceManager.sourceBContainerOrLink instanceof StructureLink)
            this.runLink(colony.resourceManager.sourceBContainerOrLink, colony);
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
