export class CreepUtility {
    /**
     * Attemps to swap positions with a creep.
     * @param creep
     */
    public swap(creepA: Creep, creepB: Creep): boolean {
        if (creepA.pos.getRangeTo(creepB) > 1)
            return false;

        var moveA = creepA.pos.getDirectionTo(creepB);
        var moveB = creepB.pos.getDirectionTo(creepA);

        var resultA = creepA.move(moveA);
        if (resultA != OK)
            return false;

        var resultB = creepB.move(moveB);
        return resultB == OK;
    }    
}
