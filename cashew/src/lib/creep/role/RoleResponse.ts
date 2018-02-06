import { ActivityResponse } from "../activity/ActivityResponse";

export class RoleResponse {
    public activityResponses: { [activityId: string]: ActivityResponse[] };

    /** true if the role changed targets during execution. */
    public activityChanged: boolean;
    // actions used    
}