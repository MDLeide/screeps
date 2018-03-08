export class FlagMonitor {

    // prefixes[prefix] = type
    private prefixes: { [prefix: string]: FlagType } = {
        "op": FLAG_OPERATION
    };

    public update(): void {
        for (let key in Game.flags) {

        }
    }
}
