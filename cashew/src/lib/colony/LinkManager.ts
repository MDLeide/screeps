import { Colony } from "./Colony";
//TODO: move most of this to resource manager
export class LinkManager {
    public execute(colony: Colony): void {
        let inputLinks = colony.resourceManager.structures.getInputLinks();
        let outputLinks = colony.resourceManager.structures.getOutputLinks();
        
        let targetLevel = this.getTargetLevel(inputLinks, outputLinks);
        let ledger = this.getLedger(inputLinks, outputLinks);
        for (var i = 0; i < inputLinks.length; i++)
            this.runLink(inputLinks[i], true, targetLevel, ledger);
        for (var i = 0; i < outputLinks.length; i++)
            this.runLink(outputLinks[i], false, targetLevel, ledger);        
    }

    private getTargetLevel(inputs: StructureLink[], outputs: StructureLink[]): number {
        let inputTotal = _.sum(inputs, p => p.energy);
        let outputTotal = _.sum(outputs, p => p.energy);
        return Math.ceil((inputTotal + outputTotal) / outputs.length);
    }

    private getLedger(inputs: StructureLink[], outputs: StructureLink[]): { [id: string]: { link: StructureLink, level: number, input: boolean } } {
        let ledger: { [id: string]: { link: StructureLink, level: number, input: boolean } } = {};
        for (var i = 0; i < inputs.length; i++)
            ledger[inputs[i].id] = { link: inputs[i], level: inputs[i].energy, input: true };
        for (var i = 0; i < outputs.length; i++)
            ledger[outputs[i].id] = { link: outputs[i], level: outputs[i].energy, input: false };
        return ledger;
    }

    private runLink(link: StructureLink, isInput: boolean, targetLevel: number, ledger: { [id: string]: { link: StructureLink, level: number, input: boolean } }): void {
        if (link.cooldown > 0 || link.energy < 100)
            return;

        let surplus = isInput ? link.energy : link.energy - targetLevel;
        if (surplus <= 100)
            return;

        let target: StructureLink;
        let targetId: string;
        let amount: number = 0;

        for (let key in ledger) { // find the link that needs the most energy
            let entry = ledger[key];
            if (entry.input)
                continue;
            let required = targetLevel - entry.level;
            if (required >= amount) {
                amount = required;
                target = entry.link;
                targetId = key;
            }
        }
        
        if (target) {
            if (isInput)
                amount = Math.min(surplus, target.energyCapacity - target.energy);
            else
                amount = Math.min(amount, surplus);
            link.transferEnergy(target, amount);
            ledger[target.id].level += amount;
            ledger[link.id].level -= amount;
        }
    }

    //private runLink(link: StructureLink, colony: Colony): void {
    //    if (link.cooldown == 0 && link.energy >= 600) {
    //        let target = colony.resourceManager.getLinkTransferTarget();
    //        if (target) {
    //            link.transferEnergy(target);
    //            colony.resourceManager.ledger.registerLinkTransferCost(
    //                Math.min(link.energy, target.energyCapacity - target.energy) * .03);
    //        }
    //    }
    //}
}
