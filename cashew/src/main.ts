import setup from "./lib/Stats";
setup();

import { GlobalConstants } from "./imp/GlobalConstants";
GlobalConstants.extend();
import { ErrorMapper } from "util/ErrorMapper";
import { Execute } from "imp/Execution";
var execute = new Execute();
execute.init();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    //(`Current game tick is ${Game.time}`);
    global.stats.reset();
    execute.main();
    //global.stats.commit();
});
