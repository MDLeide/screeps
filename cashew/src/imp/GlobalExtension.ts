import { Empire } from "../lib/empire/Empire";

import { Reporter } from "../lib/util/reports/Reporter";
import { Visuals } from "../lib/visual/Visuals";

import { CreepUtility } from "../lib/creep/CreepUtility";
import { EventLog } from "../lib/util/EventLog";
import { Logger } from "../lib/util/dbg/Logger";

import { Playback } from "../lib/util/dbg/Playback";
import { Cleaner } from "../lib/util/dbg/Cleaner";

import { WatchVisual } from "../lib/visual/WatchVisual";

import { Test } from "../lib/Test";

export class GlobalExtension {
    public static extend() {
        let visuals = new Visuals();
        global.visuals = visuals;
        global.v = visuals;

        let reports = new Reporter();
        global.reports = reports;
        global.r = reports;

        let debug = new WatchVisual();
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

        global.start = function () {
            Playback.start();
        }

        global.step = function () {
            Playback.step();
        }


        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }

        global.startFlagOp = function (flagName: string, type: FlagOperationType, hostColony: string): string {
            let flag = Game.flags[flagName];
            if (!flag)
                return `Flag ${flagName} not found.`;
            flag.memory.flagOperation = {
                hostColony: hostColony,
                type: type
            };
            return `Flag ${flagName} set to ${type} hosted by colony ${hostColony}`;
        }

        global.startFlagCampaign = function (flagName: string, type: FlagCampaignType, hostColony: string): string {
            let flag = Game.flags[flagName];
            if (!flag)
                return `Flag ${flagName} not found.`;
            flag.memory.flagCampaign = {
                hostColony: hostColony,
                type: type
            };
            return `Flag ${flagName} set to ${type} hosted by colony ${hostColony}`;
        }
    }
}
