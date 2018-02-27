export class TowerController {
    constructor(tower: StructureTower) {
        this.tower = tower;
        this.setThresholds();
    }

    // 0: undefined
    // 1: attack
    // 2: heal
    // 3: repair
    // 4: idle
    mode: number;
    repairTarget: Structure;
    creepTarget: Creep;
    tower: StructureTower;
    // percentage of hits to start repairing structure
    repairHitsStartThreshold: { [structureConstant: string]: number };
    // percentage of hits to repair structures to
    repairHitsStopThreshold: { [structureConstant: string]: number };

    private setThresholds(): void {                
        this.repairHitsStartThreshold = {
            "container": .5,
            "extension": .75,
            "road": .75,
            "spawn": .75,
            "storage": .75
        };

        this.repairHitsStopThreshold = {
            "container": .75,
            "extension": .9,
            "road": .9,
            "spawn": .9,
            "storage": .9
        };
    }

    public execute(): void {
        if (this.tower.energy <= 50)
            return;
        
        var lastMode = this.mode;
        this.mode = this.determineMode();       
        
        if (lastMode != this.mode) { // mode just changed so we need to refresh our targets
            this.updateTargets();
        }

        switch (this.mode) {
            case 1:
                this.attack();
                break;
            case 2:
                this.heal();
                break;
            case 3:
                this.repair();
                break;
            case 4:
                break;
        }
    }


    private determineMode(): number {
        switch (this.mode) {
            case 1: // attacking
                if (!this.doneAttacking()) {
                    return 1;
                }
                break;
            case 2: // healing
                if (!this.doneHealing()) {
                    return 2;
                }
                break;
            case 3: // repairing
                if (this.shouldAttack()) {
                    return 1;
                }
                if (this.shouldHeal()) {
                    return 2;
                }
                if (!this.doneRepairing()) {
                    return 3;
                }
                break;
            default: // idle or undefined
                break;
        }

        if (this.shouldAttack()) {
            return 1;
        }
        if (this.shouldHeal()) {
            return 2;
        }
        if (this.shouldRepair()) {
            return 3;
        }
        return 4; // idle
    }

    private updateTargets(): void {
        this.creepTarget = null;
        this.repairTarget = null;

        switch (this.mode) {
            case 1:
                this.creepTarget = this.getAttackTarget();
                break;
            case 2:
                this.creepTarget = this.getHealTarget();                
                break;
            case 3:
                this.repairTarget = this.getRepairTarget();                
                break;
            default:
                break;
        }
    }


    private shouldAttack(): boolean {        
        return this.tower.room.find(FIND_HOSTILE_CREEPS).length > 0;
    }

    private doneAttacking(): boolean {
        if (!this.creepTarget)
            return true;

        return this.creepTarget.room.name != this.tower.room.name ||
            this.creepTarget.hits == 0;
    }

    private getAttackTarget(): Creep {
        return this.tower.room.find(FIND_HOSTILE_CREEPS)[0];
    }

    private attack(): void {
        this.tower.attack(this.creepTarget);
    }



    private shouldHeal(): boolean {
        return false;
    }

    private doneHealing(): boolean {
        return true;
    }

    private getHealTarget(): Creep {
        return null;
    }
    private heal(): void {
        this.tower.heal(this.creepTarget);
    }


    private shouldRepair(): boolean {
        var structs = this.tower.room.find(FIND_MY_STRUCTURES);
        for (var i = 0; i < structs.length; i++) {
            var s = structs[i];
            if (this.repairHitsStartThreshold[s.structureType]) {
                var threshold = this.repairHitsStartThreshold[s.structureType];
                var current = s.hits / s.hitsMax;
                if (current <= threshold) {
                    return true;
                }
            }
        }

        return false;
    }

    private doneRepairing(): boolean {
        var threshold = this.repairHitsStopThreshold[this.repairTarget.structureType];
        var current = this.repairTarget.hits / this.repairTarget.hitsMax;
        return current >= threshold;

    }

    private getRepairTarget(): Structure {
        var structs = this.tower.room.find(FIND_MY_STRUCTURES);

        for (var i = 0; i < structs.length; i++) {
            var s = structs[i];
            if (this.repairHitsStartThreshold[s.structureType]) {
                if (this.repairHitsStartThreshold[s.structureType] >= (s.hits / s.hitsMax)) {
                    return s;
                }
            }
        }

        return null;
    }

    private repair(): void {
        this.tower.repair(this.repairTarget);
    }
}
