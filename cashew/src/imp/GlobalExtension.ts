import { Empire } from "../lib/empire/Empire";

import { Reporter } from "../lib/util/reports/Reporter";
import { Visuals } from "../lib/util/visual/Visuals";

import { CreepUtility } from "../lib/creep/CreepUtility";
import { EventLog } from "../lib/util/EventLog";
import { Logger } from "../lib/util/dbg/Logger";

import { Playback } from "../lib/util/dbg/Playback";
import { Cleaner } from "../lib/util/dbg/Cleaner";

import { DebugVisual } from "../lib/util/visual/DebugVisual";

import { Test } from "../lib/Test";

export class GlobalExtension {
    public static extend(empire?: Empire) {
        if (empire) {
            global.empire = empire;

            let reports = new Reporter(empire);
            global.reports = reports;
            global.r = reports;
        }        

        let visuals = new Visuals();
        global.visuals = visuals;
        global.v = visuals;


        let debug = new DebugVisual;
        global.debug = debug;
        global.d = debug;

        global.test = new Test();

        global.cleaner = new Cleaner();
        global.logger = new Logger();
        
        global.events = new EventLog();
        global.ucreep = new CreepUtility();




        global.help = function () {
            return "cleaner [c]</br>visuals [v]</br>events</br>reports [r]";
        };


        global.pause = function () {
            Playback.pause();
        }

        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }        
    }
}
