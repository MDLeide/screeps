import { Body } from "../creep/body/Body";

export class Egg {
    public name: string;
    public body : Body;
    public role: string;
    public started: boolean;
    public creep: Creep | null;
    public startTick: number;
    public completionTick: number;
}