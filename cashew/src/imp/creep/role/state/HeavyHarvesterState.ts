import { RoleState } from "../../../../lib/creep/role/state/RoleState"
import { IHeavyHarvesterState } from "./IHeavyHarvesterState"

export class HeavyHarvesterState extends RoleState implements IHeavyHarvesterState {
    phase: number;
    sourceId: string;
    containerId: string;
    constructionSiteId: string;
    constructionSiteX: number;
    constructionSiteY: number;
}
