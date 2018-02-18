import { NestMapBuilder } from "../../lib/map/NestMapBuilder";
import { NestMap } from "../../lib/map/NestMap";

import { ControllerBlockProvider } from "./ControllerBlockProvider";
import { ExtensionBlockProvider } from "./ExtensionBlockProvider";
import { HarvestBlockProvider } from "./HarvestBlockProvider";
import { MainBlockProvider } from "./MainBlockProvider";

export class StandardNestMapBuilder {
    public static getBuilder(): NestMapBuilder {
        var builder = new NestMapBuilder(
            new HarvestBlockProvider(),
            new ExtensionBlockProvider(),
            new MainBlockProvider(),
            new ControllerBlockProvider(),
            null);
        return builder;
    }
}
