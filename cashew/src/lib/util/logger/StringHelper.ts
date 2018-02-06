export class StringHelper {
    /**
     * Trim or pad to target length from start or end of string.
     * @param str
     * @param targetLength
     * @param trimLeft
     * @param padLeft
     */
    public static trimAndPad(str: string, targetLength: number, trimLeft: boolean = false, padLeft: boolean): string {
        str = str.trim();
        if (str.length > targetLength) {
            if (trimLeft) {
                return str.substr(str.length - targetLength);
            } else {
                return str.substr(0, targetLength);
            }
        }

        if (padLeft) {
            return this.padStart(str, targetLength);
        } else {
            return this.padEnd(str, targetLength);
        }
    }

    /**
     * spits the string into an array on \r and \n
     * @param str
     */
    public static splitByNewline(str: string): string[] {
        return str.split(/\r?\n/);
    }

    /**
     * Pads the start of the @str until it is @targetLength long using
     * the @padString if provided, otherwise whitespace.
     * @param str
     * @param targetLength
     * @param padString
     */
    public static padStart(str: string, targetLength: number, padString: string = " "): string {
        //if (str.length >= targetLength) {
        //    return str;
        //}

        if (!padString || padString === "") {
            padString = " ";
        }

        let padIndex = padString.length - 1;
        while (str.length < targetLength) {
            str = padString[padIndex].concat(str);
            padIndex--;
            if (padIndex < 0) {
                padIndex = padString.length - 1;
            }
        }
        return str;
    }

    public static padEnd(str: string, targetLength: number, padString: string = " "): string {
        //if (str.length >= targetLength) {
        //    return str;
        //}

        if (!padString || padString === "") {
            padString = " ";
        }

        let padIndex = 0;
        while (str.length < targetLength) {
            str = str.concat(padString[padIndex]);
            padIndex++;
            if (padIndex >= padString.length) {
                padIndex = 0;
            }
        }
        return str;
    }

    /**
     * Takes an array of strings and concatenates them.
     * @param stack Array of strings
     * @param stringToPrepend String to prepend to each string in the array.
     * @param stringToAppend String to append to each string in the array.
     */
    public static concat(stack: string[], stringToPrepend: string = '', stringToAppend: string = ''): string {
        if (!stack || stack.length == 0) {
            return stringToPrepend + stringToAppend;
        }

        let str: string = stringToPrepend + stack[0] + stringToAppend;
        for (let i = 1; i < stack.length; i++) {
            str += '\n' + stringToPrepend + stack[i] + stringToAppend;
        }
        return str;
    }
}

//private static padEndTest(str: string, targetLength: number, padString: string = " "): string {
//    //if (str.length >= targetLength) {
//    //    return str;
//    //}

//    if (!padString || padString === "") {
//        padString = " ";
//    }

//    while (str.length < targetLength) {
//        let delta = targetLength - str.length;
//        let concatLen = Math.min(delta, padString.length);

//        str = str.concat(padString.substr(0, concatLen));            
//    }
//    return str;
//}

// takes an Error.stack string and cleans it up according to the cfg file. depth
// is the number of levels the stack should include - set the values in the config.
// automatically ignores the top level Util call.
