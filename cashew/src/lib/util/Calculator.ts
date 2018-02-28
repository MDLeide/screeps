export class Calculator {
    public static calculateSourceProfit(
        origin: RoomPosition,
        source: Source,
        reserved: boolean,
        roads: boolean,
        carryCapacity: number
    ): { path: PathFinderPath, profit: number } {
        let path = PathFinder.search(origin, { pos: source.pos, range: 1 });
        if (path.incomplete)
            return null;

        if (path.path.length < 3)
            return null;

        let travelTime = roads ? path.path.length : path.cost;
        let distance = path.path.length;

        let energyPerTick = (reserved ? 5 : 3) * 2;

        let energyPerLifetime = reserved ? 15000 : 7500;
        let trips = 1500 / travelTime * 2;

        let workParts = reserved ? 5 : 3;

        let harvesterTicksPerMove = (reserved ? 5 : 3) / (roads ? 2 : 1);
        let harvesterTravelTime = distance * harvesterTicksPerMove;

        let harvesterCost = BODYPART_COST[WORK] * workParts + BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
        let totalHarvesterCost = harvesterCost * 1 + (harvesterTravelTime / 1500);

        let carryParts = Math.ceil(energyPerLifetime / trips / carryCapacity);
        let moveParts = roads ? Math.ceil(carryParts / 2) : carryParts;

        let haulerCost = BODYPART_COST[CARRY] * carryParts + BODYPART_COST[MOVE] * moveParts;

        let containerCost = 750;

        let totalLifetimeCost = totalHarvesterCost + haulerCost + containerCost;

        return {
            path: path,
            profit: energyPerLifetime - totalLifetimeCost
        };
    }
}
