import { Job } from "./creep/Job";

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
}
