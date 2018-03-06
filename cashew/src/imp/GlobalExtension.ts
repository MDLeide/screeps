import { Playback } from "../lib/util/dbg/Playback";
import { Cleaner } from "../lib/util/dbg/Cleaner";
import { Logger } from "../lib/util/dbg/Logger";

import { EventLog } from "../lib/util/EventLog";
import { Visuals } from "../lib/util/visual/Visuals";
import { CreepUtility } from "../lib/creep/CreepUtility";

import { Test } from "./Test";


export class GlobalExtension {
    public static extend() {
        global.cleaner = new Cleaner();
        global.logger = new Logger();
        global.visuals = new Visuals();
        global.events = new EventLog();
        global.ucreep = new CreepUtility();

        global.help = function () {
            return "cleaner</br>visuals</br>events";
        };
        global.pause = function () { Playback.pause(); }
        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }

        global.test = function () {
            return Test.test();            
        }
    }
}
