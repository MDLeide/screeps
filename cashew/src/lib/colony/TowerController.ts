import { Colony } from "./Colony";

export class TowerController {
    public update(colony: Colony, tower: StructureTower): void {
    }

    public execute(colony: Colony, tower: StructureTower): void {
        if (colony.watchtower.healTarget)
            tower.heal(colony.watchtower.healTarget)
        else if (colony.watchtower.attackTarget)
            tower.attack(colony.watchtower.attackTarget);        
    }

    public cleanup(colony: Colony, tower: StructureTower): void {

    }
}
