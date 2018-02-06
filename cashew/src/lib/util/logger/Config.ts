import { LoggerConfig } from './LoggerConfig';
import { DebugConfig } from './DebugConfig';

export class Configuration {
    public static Console: LoggerConfig = new LoggerConfig();
    public static C: LoggerConfig = Configuration.Console;

    public static Debug: DebugConfig = new DebugConfig();
    public static D: DebugConfig = Configuration.Debug;

    public static tickDisplayResolution: number = 1;
    public static showTicks: boolean = true;
    public static bigTickMarkers: boolean = true;
}