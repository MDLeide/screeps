import { Nest } from "./Nest";
import { ColonyPlan } from "./ColonyPlan";
import { Guid } from "../../util/GUID";
import { Empire } from "../empire/Empire";

export class Colony  {
    constructor(nest: Nest, name: string) {
        this.nest = nest;
        this.id = Guid.newGuid();
    }

    public id: string;
    public name: string;
    public nest: Nest;
    public plan: ColonyPlan;

    public update(empire: Empire): void {
        this.plan.update(this);
    }

    public execute(empire: Empire): void {
        this.plan.execute(this);
    }

    public cleanup(empire: Empire): void {
        this.plan.cleanup(this);
    }
}
