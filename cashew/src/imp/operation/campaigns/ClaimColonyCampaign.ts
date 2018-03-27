import { Campaign } from "lib/operation/Campaign";
import { Operation } from "lib/operation/Operation";
import { Colony } from "lib/colony/Colony";
import { NewSpawnConstructionOperation } from "../infrastructure/NewSpawnConstructionOperation";
import { RoomScoutOperation } from "../military/RoomScoutOperation";
import { ClaimRoomOperation } from "../military/ClaimRoomOperation";

export class ClaimColonyCampaign extends Campaign {    
    public static fromMemory(memory: ClaimColonyCampaignMemory): ClaimColonyCampaign {
        let campaign = Object.create(ClaimColonyCampaign.prototype) as ClaimColonyCampaign;
        campaign.roomName = memory.roomName;
        return Campaign.fromMemory(memory, campaign) as ClaimColonyCampaign;
    }

    constructor(roomName: string) {
        super(CAMPAIGN_CLAIM_COLONY);
        this.roomName = roomName;
        this.addOperation(new ClaimRoomOperation(roomName));
    }

    public roomName: string;

    protected operationFinished(operation: Operation, colony: Colony): void {
        if (operation.type == OPERATION_CLAIM_ROOM) {
            let colony = global.empire.colonyFinder.createColony(this.roomName);
            if (!colony)
                colony = global.empire.getColonyByName("Colony " + this.roomName);

            if (!colony) {
                this.addOperation(new RoomScoutOperation(this.roomName));
            } else {
                let loc = colony.nest.nestMap.mainBlock.getSpawnLocation(1);
                this.addOperation(new NewSpawnConstructionOperation(this.roomName, loc));
            }
        } else if (operation.type == OPERATION_ROOM_SCOUT) {
            let colony = global.empire.colonyFinder.createColony(this.roomName);
            if (!colony) {
                this.addOperation(new RoomScoutOperation(this.roomName));
            } else {
                let loc = colony.nest.nestMap.mainBlock.getSpawnLocation(1);
                this.addOperation(new NewSpawnConstructionOperation(this.roomName, loc));
            }
        }
    }

    public save(): ClaimColonyCampaignMemory {
        let mem = super.save() as ClaimColonyCampaignMemory;
        mem.roomName = this.roomName;
        return mem;
    }
}

export interface ClaimColonyCampaignMemory extends CampaignMemory {
    roomName: string;
}
