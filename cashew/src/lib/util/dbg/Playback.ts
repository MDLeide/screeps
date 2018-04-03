import { MemoryManager } from "../MemoryManager";
import { Settings } from "../../Settings";

/**
Works off a flag named, specifically, 'debug'.
If the flags primary color is red, no execution will occur.
If it is yellow, on Execute.init() will run.
If it is green, everything runs as normal.
All other colors have no effect.
*/
export class Playback {
    public static readonly FlagName = "debug";

    public static readonly State_Running = "running";
    public static readonly State_Paused = "paused";
    public static readonly State_Stopped = "stopped";
    public static readonly State_Step = "step;"

    
    private static _flag: Flag;
    
    public static get flag(): Flag { return this._flag; }


    public static get pauseOnException(): any {
        if (this.flag)
            return this.state.pauseOnException;
        return false;
    }
    public static set pauseOnException(val: any) { this.state.pauseOnException = val; }

    /** If true, will write messages to the console. */
    public static get doOutput(): boolean { return this.state.doOutput; }
    public static set doOutput(val: boolean) { this.state.doOutput = val; }

    public static get outputColor(): string { return this.state.outputColor; }
    public static set outputColor(val: string) { this.state.outputColor = val; }

    public static get playbackState(): string { return this.state.playbackState; }
    public static set playbackState(val: string) { this.state.playbackState = val; }

    private static get lastPlaybackState(): string { return this.state.lastPlaybackState; }
    private static set lastPlaybackState(val: string) { this.state.lastPlaybackState = val; }
    
    private static get state(): PlaybackFlagMemory { return this.flag.memory.playbackData; }


    public static placeFlag(roomName: string): void {
        if (this.flag)
            return;

        var room = Game.rooms[roomName];
        room.createFlag(25, 10, Playback.FlagName, COLOR_GREEN, COLOR_GREEN);
    }


    public static update(): void {
        this._flag = this.findFlag();
        if (!this.flag) {
            this.printTick(Settings.DefaultTickDisplayInterval);
            return;
        }

        this.checkMemory();        
        this.playbackState = this.getCurrentState();

        if (this.flag.secondaryColor == COLOR_WHITE) {
            MemoryManager.initialize();
            Playback.flag.setColor(Playback.flag.color, Playback.flag.color);
        }

        if (this.lastPlaybackState == this.State_Step && this.playbackState == this.State_Step) {
            this.pause();
        }

        if (this.lastPlaybackState != this.playbackState) {
            if (this.playbackState == this.State_Running)
                this.starting();
            else if (this.playbackState == this.State_Paused)
                this.pausing();
            else if (this.playbackState == this.State_Stopped)
                this.stopping();
            else if (this.playbackState == this.State_Step)
                this.stepping();
        }

        if (this.playbackState == this.State_Running || this.playbackState == this.State_Step) {
            this.printTick(Settings.DefaultTickDisplayInterval);
        }

        this.lastPlaybackState = this.playbackState;
    }



    public static init(): boolean {
        if (!this.flag)
            return true;
        return this.playbackState != this.State_Stopped;
    }

    public static loop(): boolean {
        if (!this.flag)
            return true;

        return this.playbackState == this.State_Running || this.playbackState == this.State_Step;
    }


    public static stop(): void {
        if (!this.flag)
            return;        
        this.flag.setColor(COLOR_RED);
        this.playbackState = this.State_Stopped;
    }

    public static pause(): void {
        if (!this.flag)
            return;
        this.flag.setColor(COLOR_YELLOW);
        this.playbackState = this.State_Paused;
    }

    public static start(): void {
        if (!this.flag)
            return;
        this.flag.setColor(COLOR_GREEN);
        this.playbackState = this.State_Running;
    }

    public static step(): void {
        if (!this.flag)
            return;
        this.flag.setColor(COLOR_GREY);
        this.playbackState = this.State_Step;
    }


    private static stopping(): void {
        if (this.doOutput)
            global.events.debug.playbackStop();
    }

    private static pausing(): void {
        if (this.doOutput)
            global.events.debug.playbackPause();
    }

    private static starting(): void {
        if (this.doOutput)
            global.events.debug.playbackStart();
    }

    private static stepping(): void {
        if (this.doOutput)
            global.events.debug.playbackStep();
    }


    private static printTick(interval: number): void {
        if (interval > 0) {
            if (interval == 1 || Game.time % interval == 0) {
                var message = `Current game tick is ${Game.time}`;
                var color = "lightBlue";
                console.log(`<span style='color:${color}'>${message}</span>`);
            }
        }
    }

    private static checkMemory(): void {
        if (!this.flag)
            return;
        if (!this.flag.memory)
            this.flag.memory = {}
        
        if (!this.flag.memory.playbackData)
            this.flag.memory.playbackData = {
                pauseOnException: true,
                doOutput: true,
                outputColor: "orange",
                playbackState: this.State_Running,
                lastPlaybackState: this.State_Running
            };
            
        return;
    }

    private static getCurrentState(): string {
        if (!this.flag)
            return this.State_Running;

        if (this.flag.color == COLOR_GREEN)
            return this.State_Running;
        if (this.flag.color == COLOR_YELLOW)
            return this.State_Paused;
        if (this.flag.color == COLOR_RED)
            return this.State_Stopped;
        if (this.flag.color == COLOR_GREY)
            return this.State_Step;

        return this.State_Running;
    }    

    private static findFlag(): Flag | null | undefined {
        return Game.flags[Playback.FlagName];
    }
}
