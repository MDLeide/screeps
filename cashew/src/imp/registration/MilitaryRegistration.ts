import { TargetingTacticsRepository } from "../../lib/military/TargetingTactics";

import { StandardTargetingTactics } from "../military/tactics/StandardTargetingTactics";

import { SquadMemberRepository } from "../../lib/military/SquadMember";

import { Healer } from "../creep/military/Healer";
import { Hoplite } from "../creep/military/Hoplite";
import { Ranger } from "../creep/military/Ranger";

export class MilitaryRegistration {
    public static register(): void {
        this.registerTactics();
        this.registerUnitMembers();
    }

    private static registerTactics(): void {
        TargetingTacticsRepository.register(TARGETING_TACTICS_STANDARD, () => new StandardTargetingTactics());
    }

    private static registerUnitMembers(): void {
        SquadMemberRepository.register(UNIT_MEMBER_HEALER, (mem) => Healer.fromMemory(mem));
        SquadMemberRepository.register(UNIT_MEMBER_HOPLITE, (mem) => Hoplite.fromMemory(mem));
        SquadMemberRepository.register(UNIT_MEMBER_RANGER, (mem) => Ranger.fromMemory(mem));
    }
}
