import { CampaignRepository } from "lib/operation/Campaign";
import { ClaimColonyCampaign, ClaimColonyCampaignMemory } from "../operation/campaigns/ClaimColonyCampaign";
import { FlagCampaignRepository } from "lib/operation/FlagCampaign";
import { ClaimColonyFlagCampaign } from "../operation/flag/ClaimColonyFlagCampaign";

export class CampaignRegistration {
    public static register(): void {
        this.registerCampaigns();
        this.registerFlags();
    }

    private static registerCampaigns(): void {
        CampaignRepository.register(
            CAMPAIGN_CLAIM_COLONY,
            (mem: CampaignMemory) => ClaimColonyCampaign.fromMemory(mem as ClaimColonyCampaignMemory));
    }

    private static registerFlags(): void {
        FlagCampaignRepository.register(
            FLAG_CAMPAIGN_CLAIM_COLONY,
            (flag: Flag) => new ClaimColonyFlagCampaign(flag));
    }
}
