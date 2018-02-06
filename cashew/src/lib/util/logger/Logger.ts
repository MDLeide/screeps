//todo: implement logStreams, which provide access to the logger in an encapsulated and controlled mannager.
// log stream takes all messages and holds them in cache, until flush or discard is called. this would allow you
// to generate a stream at any arbitrary points, and decide to print or terminate it based on conditions at another arbitrary point
// if additional streams are opened, they genereate child streams. 

//todo: implement configurable colors
//todo: rework system to use <Message>s easing the transition to streams, buffers, and configurability
//todo: implement an optional buffer, to allow the printing of execution path history when some condition is met
// for example, configure the Logger so that the .debug calls are not printed, but instead sent to a 30 line buffer. if
// an exception is encountered,  or some other condition met, print the buffer to the console
//todo: option to show full method name, regardless of width
import { TraceHelper } from './TraceHelper';
import { StringHelper } from './StringHelper';

//todo: change this and refactor this mess of a file
import { Configuration as cfg } from './Config';

export class Logger {
    // we're excluding STACK_LEVELS_TO_IGNORE from the trace string, where STACK_LEVELS_TO_IGNORE - 1 is the number of calls
    // made inside the module before the Error object is generated, plus 1 for the top 'ERROR' line
    static MESSAGE_TYPE_DEBUG = 'DEBUG';
    static MESSAGE_TYPE_DEBUG_ENTER = 'D_ENT';
    static MESSAGE_TYPE_DEBUG_RETURN = 'D_RET';
    static MESSAGE_TYPE_EXCEPTION = 'EXEPT';
    static MESSAGE_TYPE_WARNING = 'WARN';
    static MESSAGE_TYPE_INFO = 'INFO';
    static MESSAGE_TYPE_TICK = 'TICK';
    static MESSAGE_TYPE_SIM = 'SIM';
    static MESSAGE_TYPE_SIM_ENTER = 'S_ENT';
    static MESSAGE_TYPE_SIM_RETURN = 'S_RET';

    //todo: factor this whole damn thing
    private static print(messageType: string, message: string, context: any = 'no-arg-passed', suppressTrace: boolean = false, error?: Error, includeCaller: boolean = false): void {
        let traceString: string = '';
        let callerString: string = '';

        if (cfg.C.useBlacklist) {
            let method: string = TraceHelper.getStackTraceString(3, '', '', 1);
            for (let i = 0; i < cfg.C.blacklist.length; i++) {
                if (method.startsWith(cfg.C.blacklist[i])) {
                    return;
                }
            }
        }

        if (!cfg.C.suppressAllTraces && !suppressTrace) {
            let doTrace: boolean = false;
            let depth: number = -1;

            if (cfg.C.printDebug && (messageType === this.MESSAGE_TYPE_DEBUG || messageType === this.MESSAGE_TYPE_DEBUG_ENTER || messageType === this.MESSAGE_TYPE_DEBUG_RETURN)) {
                doTrace = true;
                depth = cfg.C.printDebugTraceDepth;
            } else if (cfg.C.printInfoTrace && messageType === this.MESSAGE_TYPE_INFO) {
                doTrace = true;
                depth = cfg.C.printInfoTraceDepth;
            } else if (cfg.C.printWarningTrace && messageType === this.MESSAGE_TYPE_WARNING) {
                doTrace = true;
                depth = cfg.C.printWarningTraceDepth;
            } else if (messageType === this.MESSAGE_TYPE_EXCEPTION) {
                if (error) {
                    traceString += TraceHelper.getStackTraceStringFromError(error, 3, cfg.C.stringToPrependToStackTraceLine, cfg.C.stringToAppendToStackTraceLine);
                }
                doTrace = false;
            }

            if (doTrace) {
                if (cfg.C.useInlineTraceStyle) {
                    traceString = TraceHelper.getStackTraceString(3, '', '', 1);
                    if (includeCaller) {
                        callerString = TraceHelper.getStackTraceString(4, ' [', ']', 1);
                    }
                    traceString = StringHelper.trimAndPad(traceString, cfg.C.inlineMethodWidth, true, false) + ' | ';
                } else {
                    traceString = '\n' + TraceHelper.getStackTraceString(3, cfg.C.stringToPrependToStackTraceLine, cfg.C.stringToAppendToStackTraceLine, depth);
                }
            }
        }

        let leftSideString: string;
        let rightSideString: string;

        if (cfg.C.useInlineTraceStyle) {
            message = traceString + message + callerString;
            traceString = '';
        }

        leftSideString = this.getLeftSideString(messageType, message);
        rightSideString = this.getRightSideString(context, leftSideString.length);

        console.log(leftSideString + rightSideString + traceString);

        if (context !== 'no-arg-passed' && cfg.C.outputContextSeparately) {
            console.log(context);
        }
    }

    private static getLeftSideString(messageType: string, message: string): string {
        if (!message) { message = ''; }
        messageType = StringHelper.trimAndPad(messageType, cfg.C.messageTypeWidth, true, false);

        let leftSideString = messageType + ': ' + message;

        if (cfg.C.consoleWidth > 0) {
            let leftSideAvailableSpace = cfg.C.consoleWidth - cfg.C.minimumContextWidth;

            if (leftSideString.length > leftSideAvailableSpace) {
                leftSideString = leftSideString.substr(0, leftSideAvailableSpace);
            }
        }

        return leftSideString;
    }

    private static getRightSideString(context: any, leftSideLen: number): string {
        let contextString: string;
        if (context === 'no-arg-passed') {
            contextString = '';
        } else {
            contextString = this.prepareContext(context.toString());
        }

        if (cfg.C.consoleWidth > 0) {
            let rightSideAvailableSpace = cfg.C.consoleWidth - leftSideLen;
            if (rightSideAvailableSpace < cfg.C.minimumContextWidth) {
                throw Logger.exception('math doesn\'t work anymore - we are all dooomed. i\'m moving to the mountains.');
            }
            return StringHelper.trimAndPad(contextString, rightSideAvailableSpace, true, true);
        }
        return ' | ' + contextString;
    }

    public static simEnter(message: string = '', context: any = 'no-arg-passed'): void {
        this.print(this.MESSAGE_TYPE_SIM_ENTER, message, context);
    }

    public static sim(message: string = '', context: any = 'no-arg-passed'): void {
        this.print(this.MESSAGE_TYPE_SIM, message, context);
    }
    
    public static simReturn<T>(message: string = '', returnValue: T): T {        
        //todo: must be a better way! how can we figure out if an optional param has an undefined arg, or is just undefined?        
        if (returnValue !== undefined) {
            this.print(this.MESSAGE_TYPE_SIM_RETURN, message, returnValue);
        } else {
            this.print(this.MESSAGE_TYPE_SIM_RETURN, message);
        }
        
        return returnValue;
    }

    public static long(longMessage: string) {
        console.log(longMessage);
    }

    public static info(message: string, context: any = 'no-arg-passed') {
        if (cfg.C.printInfo) {
            this.print(this.MESSAGE_TYPE_INFO, message, context);
        }
    }

    public static warning(message: string, context: any = 'no-arg-passed') {
        if (cfg.C.printWarning) {
            this.print(this.MESSAGE_TYPE_WARNING, message, context);
        }
    }

    public static tick() {
        if (cfg.showTicks) {
            this.doTick(Game.time, cfg.D.doSlowMotion, cfg.bigTickMarkers);
        }
    }

    public static doTick(tick: number, slowMo: boolean = false, bigTick: boolean = false) {
        if (slowMo && tick % cfg.D.slowMotionModifier !== 0) {
            return;
        }

        let tickString = tick.toString();
        if (slowMo) {
            tickString += ' (slow mo x' + cfg.D.slowMotionModifier + ')';
        }
        if (bigTick) {
            this.print(this.MESSAGE_TYPE_TICK, StringHelper.padEnd('', 10, '-'));
            this.print(this.MESSAGE_TYPE_TICK, tickString);
            this.print(this.MESSAGE_TYPE_TICK, StringHelper.padEnd('', 10, '-'));
        } else {
            this.print(this.MESSAGE_TYPE_TICK, tickString);
        }
    }

    public static exception(type: string, message?: string, context: any = 'no-arg-passed', suppressThrow: boolean = false): Error {
        let error = new Error(message ? message : 'no data');
        error.name = type;

        if (cfg.C.printException) {
            message = ' ' + type.toUpperCase() + ' | ' + (message ? message : '');
            this.print(this.MESSAGE_TYPE_EXCEPTION, message, 'no-arg-passed', true);

            if (context !== 'no-arg-passed' && cfg.C.outputExceptionContext) {
                console.log(context);
            }
            console.log(TraceHelper.getStackTraceStringFromError(error, 2, cfg.C.stringToPrependToStackTraceLine, cfg.C.stringToAppendToStackTraceLine));
        }

        if (!suppressThrow && cfg.C.throwException) {
            throw error;
        }

        return error;
    }

    public static debug(message: string, context: any = 'no-arg-passed', includeCaller: boolean = false) {
        if (cfg.C.printDebug) {
            this.print(this.MESSAGE_TYPE_DEBUG, message, context, false, undefined, includeCaller);
        }
    }

    public static e() {
        this.print(this.MESSAGE_TYPE_DEBUG_ENTER, '');
    }

    public static enter(message: string = '', context: any = 'no-arg-passed'): void {
        //todo: trace execution
        if (cfg.C.printDebug) {
            this.print(this.MESSAGE_TYPE_DEBUG_ENTER, message, context);
        }        
    }    

    public static return(message: string, context: any = 'no-arg-passed') {
        //todo: trace execution
        if (cfg.C.printDebug) {
            this.print(this.MESSAGE_TYPE_DEBUG_RETURN, message, context);
        }
    }

    public static r<T>(message: string, returnVal: T): T {
        this.print(this.MESSAGE_TYPE_DEBUG_RETURN, message, returnVal);
        return returnVal;
    }

    public static debugEnterMethod(message: string, context: any = 'no-arg-passed') {
        //todo: trace execution
        if (cfg.C.printDebug) {
            this.print(this.MESSAGE_TYPE_DEBUG_ENTER, message, context);
        }
    }

    public static debugLeaveMethod(message: string, context: any = 'no-arg-passed') {
        //todo: trace execution
        if (cfg.C.printDebug) {
            this.print(this.MESSAGE_TYPE_DEBUG_RETURN, message, context);
        }
    }

    // tries to surround the string with a single space and square [ brackets ]
    private static prepareContext(context: string): string {
        if (!context || context === '') {
            return '';
        }

        context = context.trim();
        if (!context.startsWith('[')) {
            context = '[ ' + context;
        }

        if (!context.endsWith(']')) {
            context += ' ]';
        }

        return context;
    }
}
