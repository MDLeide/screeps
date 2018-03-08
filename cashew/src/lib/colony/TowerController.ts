import { Colony } from "./Colony";

export class TowerController {
    public update(colony: Colony, tower: StructureTower): void {
    }

    public execute(colony: Colony, tower: StructureTower): void {
        if (colony.watchtower.healTarget) {
            let healResponse = tower.heal(colony.watchtower.healTarget);
            if (healResponse == OK)
                colony.resourceManager.ledger.registerTowerFire(10);
        }
            
        else if (colony.watchtower.attackTarget) {
            let attackResponse = tower.attack(colony.watchtower.attackTarget);
            if (attackResponse == OK)
                colony.resourceManager.ledger.registerTowerFire(10);
        }            
    }

    public cleanup(colony: Colony, tower: StructureTower): void {

    }
}
