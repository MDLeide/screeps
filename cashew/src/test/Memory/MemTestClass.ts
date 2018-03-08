export class MemTestClass {
    constructor() {
        this.state = {
            boolA: false,
            boolB: false,
            boolC: false,
            intA: 0,
            intB: 0,
            intC: 0,
            stringA: "",
            stringB: "",
            stringC: "",
            stringArrayA: [],
            stringArrayB: [],
            extendedBoolA: false,
            extendedBoolB: false
        };
    }

    public state: MemTestExtendedMemory;

    public get boolA(): boolean { return this.state.boolA; }
    public set boolA(val: boolean) { this.state.boolA = val; }

    public get arrayA(): string[] { return this.state.stringArrayA; }
    public set arrayA(val: string[]) { this.state.stringArrayA = val;}
}

interface MemTestExtendedMemory extends MemTestMemory {
    extendedBoolA: boolean;
    extendedBoolB: boolean;
}
