import { Colony } from "../colony/Colony";
import { Campaign } from "./Campaign";

export abstract class FlagCampaign {
    constructor(flag: Flag, type: FlagCampaignType) {
        this.flag = flag;
        this.type = type;
    }

    public type: FlagCampaignType;
    public flag: Flag;

    public abstract getHostColony(): Colony;
    public abstract getCampaign(): Campaign;
}

export class FlagCampaignDiscovery {
    public static findFlagCampaigns(): void {
        let names = Object.keys(Game.flags);
        for (var i = 0; i < names.length; i++) {
            let flag = Game.flags[names[i]];
            if (flag.memory.flagCampaign)
                this.checkFlag(flag);
        }
    }

    private static checkFlag(flag: Flag): void {
        if (!flag.memory.flagCampaign)
            return;

        let flagOp = FlagCampaignRepository.getNew(flag.memory.flagCampaign.type, flag);
        let campaign = flagOp.getCampaign();
        if (!campaign) {
            flag.remove();
            return;
        }

        let colony = flagOp.getHostColony();
        if (!colony) {
            flag.remove();
            return;
        }

        colony.campaigns.push(campaign);
        flag.remove();
    }
}

export class FlagCampaignRepository {
    private static delegates: { [type: string]: (flag: Flag) => FlagCampaign } = {};

    public static register(type: FlagCampaignType, createNew: (flag: Flag) => FlagCampaign): void {
        this.delegates[type] = createNew;
    }

    public static getNew(type: FlagCampaignType, flag: Flag): FlagCampaign {
        return this.delegates[type](flag);
    }
}
