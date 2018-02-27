import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";
import { Logger } from "../lib/debug/Logger";

import { EventLog } from "../lib/util/EventLog";
import { Visuals } from "../lib/visual/Visuals";
import { UCreep } from "../lib/wrapper/Creep";

export class GlobalExtension {
    public static extend() {
        global.cleaner = new Cleaner();
        global.logger = new Logger();
        global.visuals = new Visuals();
        global.events = new EventLog();
        global.ucreep = new UCreep();

        global.help = function () {
            return "cleaner</br>visuals</br>events";
        };
        global.pause = function () { Playback.pause(); }
        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }
    }
}
