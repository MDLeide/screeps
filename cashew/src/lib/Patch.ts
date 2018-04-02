export class Patch {
    private static patches: {
        [major: number]: {
            [minor: number]: {
                [patch: number]: () => void;
            }
        }
    }

    public static patch(): void {
        this.registration();
        let patch = this.patches[global.system.version.major][global.system.version.minor][global.system.version.patch];
        if (patch)
            patch();
    }

    private static registration(): void {

    }

    private static register(majorVersion: number, minorVersion: number, patchVersion: number, patch: () => void): void {
        this.patches[majorVersion][minorVersion][patchVersion] = patch;
    }
}
