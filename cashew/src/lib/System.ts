import { Job } from "./creep/Job";
import { SystemSettings } from "imp/Execution";

export class SystemBuilder {
    public static getSystem(): System {
        let system = this.buildSystem();
        this.checkVersion(system);
        this.updateResets(system);
        this.saveMemory(system);
        return system;
    }


    private static buildSystem(): System {
        let system = new System(
            SystemSettings.systemName,
            new Version(SystemSettings.major, SystemSettings.minor, Memory.system.patch),
            Memory.system.lastUpdate
        );

        system.debug = SystemSettings.forceDebug ? SystemSettings.forceDebugValue : Memory.system.debug;
        system.resetHistory = Memory.system.resetHistory;
        system.codeChangeHistory = Memory.system.codeChangeHistory;

        return system;
    }

    private static checkVersion(system: System): void {
        if (system.version.major != Memory.system.major || system.version.minor != Memory.system.minor)
            system.version.patch = 0; // reset patch on major/minor update
    }

    private static updateResets(system: System): void {
        system.resetHistory.push(Game.time);

        if (module.timestamp != system.lastUpdate) {
            system.lastUpdate = module.timestamp;
            system.codeChangeHistory.push(Game.time);
            if (SystemSettings.automaticallyIncrementPatch)
                system.version.patch++;
        } else {
            system.forcedResetHistory.push(Game.time);
        }   

        if (system.codeChangeHistory.length > 5)
            system.codeChangeHistory.splice(0, 1);
        if (system.resetHistory.length > 5)
            system.resetHistory.splice(0, 1);
        if (system.forcedResetHistory.length > 5)
            system.forcedResetHistory.splice(0, 1);
    }

    private static saveMemory(system: System): void {
        Memory.system = {
            major: system.version.major,
            minor: system.version.minor,
            patch: system.version.patch,
            debug: system.debug,
            name: system.name,
            lastUpdate: system.lastUpdate,
            resetHistory: system.resetHistory,
            codeChangeHistory: system.codeChangeHistory
        }
    }
}

export class System {
    constructor(name: string, version: Version, lastUpdate: number) {
        this.name = name;
        this.version = version;
        this.lastUpdate = lastUpdate;
    }

    public name: string;
    public version: Version;
    public lastUpdate: number;
    public debug: boolean = false;
    /** Stores the ticks of the last 5 times global was reset. Includes code changes. Oldest has the lowest index. */
    public resetHistory: number[] = [];
    /** Stores the ticks of the last 5 times global was reset, excluding code change resets. Oldest has the lowest index. */
    public forcedResetHistory: number[] = [];
    /** Stores the ticks of the last 5 times code was loaded. Oldest has the lowest index. */
    public codeChangeHistory: number[] = [];

    /** True if the global context was reset between this tick and last. */
    public get globalReset(): boolean {
        if (!this.resetHistory.length)
            return false;
        return this.resetHistory[this.resetHistory.length - 1] == Game.time;
    }
    /** True if code was loaded between this tick and last. */
    public get codeChange(): boolean {
        if (!this.codeChangeHistory.length)
            return false;
        return this.codeChangeHistory[this.codeChangeHistory.length - 1] == Game.time;
    }

    public getCurrentGlobalAge(excludeCodeChanges: boolean = false): number {
        if (excludeCodeChanges && this.forcedResetHistory.length)
            return Game.time - this.forcedResetHistory[this.forcedResetHistory.length - 1];
        else if (!excludeCodeChanges && this.resetHistory.length)
            return Game.time - this.resetHistory[this.resetHistory.length - 1];
        else
            return 0;
    }

    public getLastGlobalAge(excludeCodeChanges: boolean = false): number {
        if (excludeCodeChanges && this.forcedResetHistory.length >= 2)
            return this.forcedResetHistory[this.forcedResetHistory.length - 1] - this.forcedResetHistory[this.forcedResetHistory.length - 2];
        else if (!excludeCodeChanges && this.resetHistory.length >= 2)
            return this.resetHistory[this.resetHistory.length - 1] - this.resetHistory[this.resetHistory.length - 2];
        else
            return 0;
    }

    /** Gets the average number of ticks that global lasted for over the past 5 resets (4 periods). Excludes current age. */
    public getAverageGlobalAge(excludeCodeChanges: boolean = true): number {
        let ageSum = 0;
        let count = 0;
        if (excludeCodeChanges) {
            for (var i = 0; i < this.forcedResetHistory.length - 1; i++) {
                ageSum += this.forcedResetHistory[i + 1] - this.forcedResetHistory[i];
                count++;
            }
        } else {
            for (var i = 0; i < this.resetHistory.length - 1; i++) {
                ageSum += this.resetHistory[i + 1] - this.resetHistory[i];
                count++;
            }
        }
        if (count == 0)
            return 0;
        return Math.round(ageSum / count);
    }


    public toString(): string {
        return `${this.name} ${this.version.toString()}`;
    }
}

export class Version {
    constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public major: number;
    public minor: number;
    public patch: number;

    public equals(major: number, minor: number, patch: number, ignorePatch?: boolean): boolean
    public equals(version: Version, ignorePatch?: boolean): boolean
    public equals(versionOrMajor: Version | number, ignorePatchOrMinor: boolean | number = false, patch?: number, ignorePatch: boolean = false): boolean {
        if (versionOrMajor instanceof Version)
            return this.equals(versionOrMajor.major, versionOrMajor.minor, versionOrMajor.patch, ignorePatchOrMinor as boolean);
        
        return this.major == versionOrMajor as number && this.minor == ignorePatchOrMinor as number && (ignorePatch || this.patch == patch);
    }

    public toString(): string {
        return `v${this.major}.${this.minor}.${this.patch}`;
    }
}
