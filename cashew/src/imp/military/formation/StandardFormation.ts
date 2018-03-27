import { Formation, FormationPosition } from "../../../lib/military/Formation";

export class StandardFormation {
    public static getFormation(): Formation {
        let vanguard = new FormationPosition("vanguard", 0, 0);
        let positions = [
            new FormationPosition("left", -1, 1),
            new FormationPosition("right", 1, 1)
        ];
        return new Formation(vanguard, positions, FORMATION_STANDARD);
    }    
}
