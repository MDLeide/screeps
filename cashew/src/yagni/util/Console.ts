export class Console {
    //todo: allow for configuration regarding the setting of visual properties (color, size, etc.) and how/when they affect the output
    // for example - configuration that says 'regardless of what the settings when a message was written to the buffer, use the current settings when print is called', etc.

    private stdOut: (msg: string, ...opt: any[]) => void;
    private buffer: { style?: Style, message: string }[] = [];


    constructor(stdOut: (message: string, ...opt: any[]) => void) {
        this.stdOut = stdOut;        
    }

    /** Color name or hex color to use for printing text. Use 'def' for default. */
    public color: string = 'def';
    /** Text size. Use -1 for default. */
    public size: number = -1;
    /** Text face. Use 'def' for default. */
    public face: string = 'def';

    public lineTerminator: string = '\n';

    //todo: change writeLine to auto - print, and remove printLine

    /** Temporarily saves the current console settings. */
    public save(): void {
        throw new Error('not implemented');
    }

    /** Restores settings from a save. */
    public restore(): void {
        throw new Error('not implemented');
    }

    /** Writes some text to the buffer. */
    public write(msg: string): void {
        this.push(msg);
    }

    /** Writes some text to the buffer, followed by a line terminator. */
    public writeLine(msg: string): void {
        this.push(msg + this.lineTerminator);
    }

    /** Prints the buffer to stdOut. */
    public print(): void {
        this.stdOut(this.stringifyBuffer());
        this.buffer = [];
    }

    /** Prints the message to the output immediately. */
    public printLine(message: string, style?: Style) : void {
        if (style) {
            this.stdOut(this.makeOpenTag(style) + message);
            return;
        }

        let currentStyle = this.getCurrentStyle();
        if (currentStyle) {
            this.stdOut(this.makeOpenTag(currentStyle) + message + '</p>');
            return;
        }

        this.stdOut(message);
    }

    private stringifyBuffer(): string {
        let str = '';
        let currentStyle: Style | undefined = undefined;
        let isOpen: boolean = false;

        for (var i = 0; i < this.buffer.length; i++) {
            let thisStyle = this.buffer[i].style;
            let msg = this.buffer[i].message;

            if (this.stylesAreEqual(currentStyle, thisStyle)) {
                str += msg;
            } else if (thisStyle) {
                isOpen = true;

                if (currentStyle !== null) {
                    str += '</p>';
                }
                str += this.makeOpenTag(thisStyle) + msg;;                
            }

            currentStyle = thisStyle;
        }
        if (isOpen) {
            str += '</p>';
        }
        return str;
    }

    private makeOpenTag(style: Style): string {
        return '<' + this.makeStyleString(style) + '>';
    }

    private makeStyleString(style: Style): string {
        let str = 'style=';
        if (style.color) {
            str += '"color:' + style.color + '" ';
        }
        if (style.face) {
            str += '"face:' + style.face + '"';
        }
        if (style.size) {
            str += '"font-size:' + style.size + '"';
        }
        return str;
    }

    private stylesAreEqual(a?: Style, b?: Style): boolean {
        if (!a || !b) {
            return false;
        }

        if (a.size) {
            if (!b.size) {
                return false;
            }
            if (a.size !== b.size) {
                return false;
            }
        }

        if (a.color) {
            if (!b.color) {
                return false;
            }
            if (a.color !== b.color) {
                return false;
            }
        }

        if (a.face) {
            if (!b.face) {
                return false;
            }
            if (a.face !== b.face) {
                return false;
            }
        }

        return true;
    }

    private push(msg: string) : void {
        this.buffer.push({ style: this.getCurrentStyle(), message: msg });
    }

    private getCurrentStyle(): Style | undefined {
        let style: Style = {};
        let nullify = true;
        if (this.color !== 'def') {
            style.color = this.color;
            nullify = false;
        }
        if (this.size > 0) {
            style.size = this.size;
            nullify = false;
        }
        if (this.face !== 'def') {
            style.face = this.face;
            nullify = false;
        }
        if (nullify) {
            return undefined;
        }
        return style;
    }

}

export interface Style {
    color?: string;
    face?: string;
    size?: number;
}