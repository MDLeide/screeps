type TransferTarget =
    StructureSpawn |
    StructureExtension |
    StructureContainer |
    StructureStorage |
    StructureLab |
    StructureTerminal |
    StructureTower |
    StructureNuker |
    StructureLink;

type WithdrawTarget =
    StructureContainer |
    StructureStorage |
    StructureTerminal |
    StructureLab |
    StructureLink | 
    Tombstone;

type WalkableStructure =
    StructureContainer |
    StructureRoad;

type AttackableTarget =
    Creep |
    Structure;
