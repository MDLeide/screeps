import { FlagCampaign } from "lib/operation/FlagCampaign";
import { ClaimColonyCampaign } from "../campaigns/ClaimColonyCampaign";
import { Colony } from "lib/colony/Colony";
import { Campaign } from "lib/operation/Campaign";

export class ClaimColonyFlagCampaign extends FlagCampaign {
    constructor(flag: Flag) {
        super(flag, FLAG_CAMPAIGN_CLAIM_COLONY);
    }

    public getHostColony(): Colony {
        return global.empire.getColonyByName(this.flag.memory.flagCampaign.hostColony);
    }

    public getCampaign(): Campaign {
        return new ClaimColonyCampaign(this.flag.pos.roomName);
    }
}
