import { StructurePalette } from "./StructurePalette";
import { BadgeArtist } from "./BadgeArtist";
import { VisualUtility } from "./VisualUtility";

export class StructureArtist {

    /**
     * Constructs a new StructureArtist.
     * @param palette Optional color palette to use for drawing, otherwise the default palette will be used.
     * @param room An optional string indicating the room to draw to, otherwise will draw to all rooms.
     * @param badgeArtist An optional artist used to draw badges on spawns.
     */
    constructor(room?: string, palette?: StructurePalette, badgeArtist?: BadgeArtist) {
        this.palette = palette ? palette : StructureArtist.getDefaultStructurePalette();
        this.badgeArtist = badgeArtist;
        this.room = room;
    }

    /** The room to draw to, otherwise all rooms. */
    public room: string | undefined;
    /** An opacity value to be applied to all drawings. */
    public opacity: number = 1;
    /** The color palette to use for drawing. */
    public palette: StructurePalette;
    /** An optional artist to draw badges on spawns. */
    public badgeArtist: BadgeArtist;

    /**
     * Gets a default palette which uses the standard Screeps structure colors.
     */
    public static getDefaultStructurePalette(): StructurePalette {
        var p = new StructurePalette();

        p.border = "#8FBB93";
        p.spawnBorder = "#CCCCCC";
        p.powerSpawnBorder = "#F41F33";

        p.solidSurface = "#181818";
        p.secondarySurface = "#AAAAAA";

        p.empty = "#777777";
        p.energy = "#FFE56D";
        p.mineral = "#FFFFFF";

        p.powerBankGlow = "#C90106";        
        p.powerBankSurface = "#331111";

        return p;
    }

    public drawStructure(structure: string, x: number, y: number, energyLevel?: number, mineralLevel?: number): void {
        
        switch (structure) {
            case "extension":
                this.drawExtension(x, y, energyLevel);
                break;
            case "container":
                this.drawContainer(x, y, energyLevel, mineralLevel);
                break;
            case "tower":
                this.drawTower(x, y, energyLevel);
                break;
            case "spawn":
                this.drawSpawn(x, y, energyLevel);
                break;
            case "storage":
                this.drawStorage(x, y, energyLevel, mineralLevel);
                break;
            case "lab":
                this.drawLab(x, y, mineralLevel);
                break;
            case "terminal":
                this.drawTerminal(x, y, energyLevel, mineralLevel);
                break;
            case "link":
                this.drawLink(x, y, energyLevel);
                break;
            case "observer":
                this.drawObserver(x, y);
                break;
            case "nuker":
                this.drawNuker(x, y, energyLevel, mineralLevel);
                break;
            case "powerSpawn":
                this.drawPowerSpawn(x, y);
                break;
            case "powerBank":
                this.drawPowerBank(x, y, energyLevel);
                break;
            case "extractor":
                this.drawExtractor(x, y);
                break;
            case "constructedWall":
                this.drawWall(x, y);
                break;
            case "rampart":
                this.drawRampart(x, y);
                break;
            default:
                throw Error(`Structure ${structure} not recognized.`);
        }
    }



    public drawRampart(x: number, y: number): void {
        let visual = new RoomVisual(this.room);
        VisualUtility.roundedRectangle(visual, x - .5, y - .5, 1, 1, .1, {
            fill: "#4F3535",
            opacity: this.opacity * .3,
            stroke: "#954A4A"
        });
    }

    public drawExtractor(x: number, y: number): void {
        let visual = new RoomVisual(this.room);
        visual.circle(x, y);
        visual.text("E", x, y);
    }

    public drawWall(x: number, y: number): void {
        let visual = new RoomVisual(this.room);
        VisualUtility.roundedRectangle(visual, x - .5, y - .5, 1, 1, .1, {
            fill: "#111111",
            opacity: this.opacity,
            stroke: "#0B0B0B"
        });
    }

    /**
     * Draws an extension at the given position.
     * @param x X position.
     * @param y Y position.
     * @param energyLevel An optional number between 0 and 1 indicating how full the extension is.
     */
    public drawExtension(x: number, y: number, energyLevel?: number): void {
        var visual = new RoomVisual(this.room);

        energyLevel = energyLevel ? this.clamp(energyLevel, 0, 1) : 0;
        
        visual.circle(
            x, y, {
                radius: .3,                
                stroke: this.palette.border,
                strokeWidth: .075,
                fill: this.palette.border,
                opacity: this.opacity * .6
            });        

        visual.circle(
            x, y, {
                radius: .25,
                stroke: this.palette.solidSurface,
                strokeWidth: .075,
                fill: this.palette.empty,
                opacity: this.opacity
            });

        if (energyLevel > 0)
            visual.circle(
                x, y, {
                    radius: energyLevel * .2,
                    fill: this.palette.energy,
                    opacity: this.opacity
                });
    }

    /**
     * Draws a container at the given position.
     * @param x X position.
     * @param y Y position.
     * @param energyLevel An optional number between 0 and 1 indicating how full of energy the container is.
     * @param mineralLevel An optional number between 0 and 1 indicating how full of minerals the container is.
     */
    public drawContainer(x: number, y: number, energyLevel?: number, mineralLevel?: number): void {        
        var visual = new RoomVisual(this.room);
        energyLevel = energyLevel ? this.clamp(energyLevel, 0, 1) : 0;
        mineralLevel = mineralLevel ? this.clamp(mineralLevel, 0, 1 - energyLevel) : 0;
        mineralLevel += energyLevel;
                
        var width = .5;
        var height = .65;

        var topX = x - .25;
        var topY = y - .325;

        // containers actually render with a transparent background
        //visual.rect(
        //    topX, topY,
        //    width, height,
        //    {
        //        fill: this.palette.empty,
        //        opacity: this.opacity
        //    });

        if (mineralLevel > 0)
            visual.rect(
                topX, topY + height * (1 - mineralLevel),
                width, height * mineralLevel,
                {
                    fill: this.palette.mineral,
                    opacity: this.opacity
                });

        if (energyLevel > 0)
            visual.rect(
                topX, topY + height * (1 - energyLevel),
                width, height * energyLevel,
                {
                    fill: this.palette.energy,
                    opacity: this.opacity
                });

        visual.rect(
            topX, topY,
            width, height,
            {
                fill: StructurePalette.transparent,
                stroke: this.palette.solidSurface,
                strokeWidth: .1,
                opacity: this.opacity
            });
    }

    /**
     * Draws a tower at the given position.
     * @param x X position.
     * @param y Y position.
     * @param energyLevel An optional number between 0 and 1 indicating how full of energy the tower is.
     */
    public drawTower(x: number, y: number, energyLevel?: number): void {
        // todo: could use some more polish

        var visual = new RoomVisual(this.room);
        visual.circle(
            x, y,
            {
                radius: .6,
                stroke: this.palette.border,                
                fill: this.palette.solidSurface,
                opacity: this.opacity
            });

        // drawing polys here to support rotation in the future

        var turrentPoints = [];
        turrentPoints.push([x + .2, y]);
        turrentPoints.push([x + .2, y + .8]);
        turrentPoints.push([x - .2, y + .8]);
        turrentPoints.push([x - .2, y]);

        visual.poly(
            turrentPoints,
            {
                fill: this.palette.secondarySurface,
                stroke: this.palette.solidSurface,
                strokeWidth: .05,
                opacity: this.opacity
            });



        var basePoints = [];
        basePoints.push([x - .45, y - .3]);
        basePoints.push([x + .45, y - .3]);
        basePoints.push([x + .45, y + .3]);
        basePoints.push([x - .45, y + .3]);
        basePoints.push([x - .45, y - .3]);

        visual.poly(
            basePoints,
            {
                fill: this.palette.empty,
                stroke: this.palette.solidSurface,
                strokeWidth: .05,
                opacity: this.opacity
            });

        if (energyLevel > 0) {
            var energyPoints = [];
            energyPoints.push([x - .45, y - .3]);
            energyPoints.push([x + .45, y - .3]);
            energyPoints.push([x + .45, y + .3 - .5 * (1 - energyLevel)]);
            energyPoints.push([x - .45, y + .3 - .5 * (1 - energyLevel)]);
            energyPoints.push([x - .45, y - .3]);

            visual.poly(
                energyPoints,
                {
                    fill: this.palette.energy,
                    stroke: StructurePalette.transparent,
                    opacity: this.opacity
                });
        }

        // draw border
        visual.poly(
            basePoints,
            {
                fill: StructurePalette.transparent,
                stroke: this.palette.solidSurface,
                opacity: this.opacity
            });

    }

    /**
     * Draws a spawn at the given position.
     * @param x X position.
     * @param y Y position.
     * @param energyLevel An optional number between 0 and 1 indicating how full of energy the spawn is.
     * @param name An optional string to draw above the spawn.
     */
    public drawSpawn(x: number, y: number, energyLevel?: number, name?: string): void {
        var visual = new RoomVisual(this.room);
        energyLevel = energyLevel ? this.clamp(energyLevel, 0, 1) : .5;

        visual.circle(
            x, y,
            {
                radius: .65,
                fill: this.palette.solidSurface,
                stroke: this.palette.spawnBorder,
                strokeWidth: .125,
                opacity: this.opacity
            });

        if (this.badgeArtist)
            this.badgeArtist.drawBadge(x, y, .9, .9);

        if (energyLevel > 0)
            visual.circle(
                x, y,
                {
                    radius: energyLevel / 3,
                    fill: this.palette.energy,
                    opacity: this.opacity
                });

        if (name)
            visual.text(name, x, y - .75);
    }

    /**
     * Draws a storage at the given position.
     * @param x X position.
     * @param y Y position.
     * @param energyLevel An optional number between 0 and 1 indicating how full of energy the storage is.
     * @param mineralLevel An optional number between 0 and 1 indicating how full of minerals the storage is.
     */
    public drawStorage(x: number, y: number, energyLevel?: number, mineralLevel?: number): void {
        var visual = new RoomVisual(this.room);
        energyLevel = energyLevel ? this.clamp(energyLevel, 0, 1) : 0;
        mineralLevel = mineralLevel ? this.clamp(mineralLevel, 0, 1) : 0;
        mineralLevel += energyLevel;

        var points = [];
        points.push([x, y - .8]); // top center
        points.push([x + .5, y - .7]);
        points.push([x + .6, y]); // right middle
        points.push([x + .5, y + .7]);
        points.push([x, y + .8]); // bottom center
        points.push([x - .5, y + .7]);
        points.push([x - .6, y]); // left middle
        points.push([x - .5, y - .7]);
        points.push([x, y - .8]); // back to the top center
        // this extra point ensures we have a clean line at the
        // top, eliminating a gap that would otherwise be there
        points.push([x + .5, y - .7]); 
            
        visual.poly(
            points,
            {
                fill: this.palette.solidSurface,
                stroke: this.palette.border,
                opacity: this.opacity
            }
        )

        var width =.8;
        var height = 1.1;

        var topX = x - .4;
        var topY = y - .55;

        visual.rect(
            topX, topY,
            width, height,
            {
                fill: this.palette.empty,
                opacity: this.opacity
            });

        if (mineralLevel > 0)
            visual.rect(
                topX, topY + height * (1 - mineralLevel),
                width, height * mineralLevel,
                {
                    fill: this.palette.mineral,
                    opacity: this.opacity
                });

        if (energyLevel > 0)
            visual.rect(
                topX, topY + height * (1 - energyLevel),
                width, height * energyLevel,
                {
                    fill: this.palette.energy,
                    opacity: this.opacity
                });
    }

    /**
     * Draws a lab at the given position.
     * @param x X position.
     * @param y Y position.
     * @param mineralLevel An optional number between 0 and 1 indicating how full of minerals the lab is.
     */
    public drawLab(x: number, y: number, mineralLevel?: number): void {
        var visual = new RoomVisual(this.room);
        mineralLevel = mineralLevel ? this.clamp(mineralLevel, 0, 1) : 0;

        visual.circle( // circle border
            x, y,
            {
                radius: .55,
                stroke: this.palette.border,
                fill: this.palette.solidSurface,
                opacity: this.opacity
            });

        visual.rect( // bottom rect border
            x - .4, y + .35,
            .8, .3,
            {
                stroke: this.palette.border,
                strokeWidth: .15,
                fill: StructurePalette.transparent,
                opacity: this.opacity
            });

        visual.circle( // circle structure
            x, y,
            {
                radius: .55,
                fill: this.palette.solidSurface,
                opacity: this.opacity
            });

        visual.circle( // contents background
            x, y,
            {
                radius: .4,
                stroke: StructurePalette.transparent,
                fill: this.palette.empty,
                opacity: this.opacity
            });

        if (mineralLevel > 0)
            visual.circle( // mineral contents
                x, y,
                {
                    radius: .4 * mineralLevel,
                    stroke: StructurePalette.transparent,
                    fill: this.palette.mineral,
                    opacity: this.opacity
                });

        visual.rect( // bottom structure
            x - .4, y + .35,
            .8, .3,
            {
                fill: this.palette.solidSurface,
                opacity: this.opacity
            });

        visual.rect( // energy reserves
            x - .3, y + .45,
            .6, .1,
            {
                fill: this.palette.energy,
                opacity: this.opacity
            });
    }

    public drawTerminal(x: number, y: number, energyLevel?: number, mineralLevel?: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("T", x, y);
    }

    public drawLink(x: number, y: number, energyLevel?: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("L", x, y);
    }

    public drawObserver(x: number, y: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("O", x, y);
    }

    public drawNuker(x: number, y: number, energyLevel?: number, mineralLevel?: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("N", x, y);
    }

    public drawPowerSpawn(x: number, y: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("PS", x, y);
    }

    public drawPowerBank(x: number, y: number, energyLevel?: number): void {
        var visual = new RoomVisual(this.room);
        visual.text("PB", x, y);
    }
    
    /**
     * 
     * @param val
     * @param min
     * @param max
     */
    private clamp(val: number, min: number, max: number): number {
        return Math.max(Math.min(val, max), min);
    }
}
