export class LoggerConfig {
    public consoleWidth: number = -1;
    public messageTypeWidth: number = 6;
    public inlineMethodWidth: number = 40;
    public minimumContextWidth: number = 15;

    public useInlineTraceStyle: boolean = true;

    public outputContextSeparately: boolean = false;

    /**
    *   Prints any messages sent to Util.info() to the console. This level of message
    *   mainly describes exectuion flow, and has a very high volume. Suggested only
    *   for really tough debugging situations.
    */
    public printInfo: boolean = true;
    /**
    *   Prints any messages sent to Util.warning() to the console. Defaults to true.
    *   This level of message generally indicates that something unexpected, but not
    *   undefined, occured within the software. It is most often caused by an unanticipated
    *   change of game state, but not always. The volume of these should not be very high,
    *   and it is recommended to leave this on, as it provides valuable information about
    *   a potential state that may not have been considered.
    */
    public printWarning: boolean = true;
    /**
    *   Util.Exception is used throughout the software to raise exceptions in places where
    *   the software simply cannot proceed due to invalid software state, invalid argument,
    *   or unanticipated, and therefore seemingly invalid, game state. When this option
    *   is true, exception details will be printed to the console. This may cause
    *   duplicate displays if you decide to throw the excetion with Configuration.Console.throwException,
    *   catch it, and display again.
    */
    public printException: boolean = true;
    /**        
    *   Prints any messages sent to Util.debug() to the console. These are, surprisingly,
    *   debugging messages that describe a wide array of things such as game state, program
    *   state, current configuration options, argument values, etc. Some of the messages
    *   may be even more verbose than the descriptions on these self-explanatory configuration
    *   options, and the volume is high. Very useful in debugging situations. 
    *
    */
    public printDebug: boolean = true;

    public printInfoTrace: boolean = true;
    public printInfoTraceDepth: number = 2;

    public printWarningTrace: boolean = true;
    public printWarningTraceDepth: number = 2;

    public printDebugTrace: boolean = true;
    public printDebugTraceDepth: number = 4;

    /**
    *   True to throw exception when calling Util.Exception()
    */
    public throwException: boolean = true;
    public outputExceptionContext: boolean = true;

    public suppressAllTraces: boolean = false;
    public stringToPrependToStackTraceLine: string = '\t';
    public stringToAppendToStackTraceLine: string = '';

    public cleanTrace: boolean = true;

    public useWhitelist: boolean = false;
    public useBlacklist: boolean = true;


    public blacklist: string[] = [
        'Orders',
        'Phase',
        'SimpleBin',
        'BinTransaction',
        'Simulation'
    ]

    public whitelist: string[] = [

    ]
}