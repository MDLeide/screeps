import { Empire } from "../lib/empire/Empire";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";

import { ControllerBlockProvider } from "./map/ControllerBlockProvider";
import { ExtensionBlockProvider } from "./map/ExtensionBlockProvider";
import { HarvestBlockProvider } from "./map/HarvestBlockProvider";
import { MainBlockProvider } from "./map/MainBlockProvider";

export class MapBuilder {
    public static init() {
        var nestMapBuilder = new NestMapBuilder(
            new HarvestBlockProvider(),
            new ExtensionBlockProvider(),
            new MainBlockProvider(),
            new ControllerBlockProvider(),
            null
        )
        var e = Empire.getEmpireInstance();
        e.nestMapBuilder = nestMapBuilder;
    }
}
