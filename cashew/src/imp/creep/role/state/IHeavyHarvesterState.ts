import { IRoleState } from "../../../../lib/creep/role/state/IRoleState"

export interface IHeavyHarvesterState extends IRoleState {
    phase: number;
    sourceId: string;
    containerId: string;
    constructionSiteId: string;
    constructionSiteX: number;
    constructionSiteY: number;
}
