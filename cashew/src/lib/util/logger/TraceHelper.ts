import { StringHelper } from './StringHelper';
import { Configuration as cfg } from "./Config";

export class TraceHelper {
    /**
     * Prepares a string from an Error object's stack trace.
     * @param error the error to use for the trace
     * @param topFramesToSkip the number of top frames to exclude
     * @param depth how many frames should be included in the string, after the initial skip
     */
    public static getStackTraceStringFromError(error: Error, topFramesToSkip: number, stringToPrepend: string, stringToAppend: string, depth: number = -1): string {
        let errorStack = error.stack;
        if (!errorStack) {
            let e = new Error('no stack to parse');
            e.name = 'invalid operation';
            throw e;
        }
        return this.getStackTraceStringFromString(errorStack, topFramesToSkip, stringToPrepend, stringToAppend, depth);
    }

    /**
     * 
     * @param topFramesToSkip ie. calls made between request for trace print and this call
     */
    public static getStackTraceString(topFramesToSkip: number, stringToPrepend: string, stringToAppend: string, depth: number = -1) {
        let error = new Error('stack trace');
        return this.getStackTraceStringFromError(error, topFramesToSkip + 1, stringToPrepend, stringToAppend, depth);
    }

    /**
     * Prepares a string from an Error object's stack trace.
     * @param stackTrace a string representation of a call stack, with new line characters breaking frames
     * @param topFramesToSkip the number of top frames to exclude
     * @param depth how many frames should be included in the string, after the initial skip
     */
    public static getStackTraceStringFromString(stackTrace: string, topFramesToSkip: number, stringToPrepend: string, stringToAppend: string, depth: number = -1): string {
        let stack = this.prepareStack(stackTrace, depth, cfg.C.cleanTrace, topFramesToSkip);
        let str = StringHelper.concat(stack, stringToPrepend, stringToAppend);
        return str;
    }

    /**
     * Splits a trace string into an array of [@depth] calls, excluding the top 'Error' line and any calls made inside Util.
     * @param trace A string that represents a call stack trace, with each frame seperated by a newline character.
     * @param depth
     * @param cleanLines
     */
    private static prepareStack(trace: string, depth: number = -1, cleanLines: boolean = true, skipTop: number = 0): string[] {
        let lines = StringHelper.splitByNewline(trace);
        let stack: string[] = [];

        let len: number;
        if (depth > 0) {
            len = Math.min(skipTop + depth, lines.length);
        } else {
            len = lines.length;
        }
        for (let i = skipTop; i < len; i++) { // init i to 2 to strip the Error line at the top, and the Util call
            if (cleanLines) {
                stack.push(this.cleanLine(lines[i]));
            } else {
                stack.push(lines[i]);
            }
        }
        return stack;
    }

    /**
     * Cleans one frame of a screeps.com stack trace to generate an easily readable string.
     * @param traceLine The frame to clean
     */
    private static cleanLine(traceLine: string): string {
        traceLine = traceLine.trim();
        let startIndex: number = 0;
        // trim 'at' from the start
        if (traceLine.startsWith('at')) {
            startIndex = 2;
        }
        // end at the first opening parens
        let endIndex = traceLine.indexOf('(');
        if (endIndex > 0) {
            return traceLine.substr(startIndex, endIndex - startIndex).trim();
        }
        return traceLine.substr(startIndex).trim();
    }
}
