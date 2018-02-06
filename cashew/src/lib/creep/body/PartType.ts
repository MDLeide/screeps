/*
I've split Parts up into a few different classes and one enum.
PartType, the enum holds the different part types (MOVE, CARRY, CLAIM, etc.)
PartData represents the static information about a particular part type
Part represents an instance of a part on a Body

I've taken this approach in an attempt to mitigate the impact of 
introducing boosts to the codebase.
*/

export enum PartType {
    ATTACK,
    CARRY,
    CLAIM,
    HEAL,
    MOVE,
    RANGED_ATTACK,
    TOUGH,
    WORK
}