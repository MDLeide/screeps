export class VisualUtility {
    public static roundedRectangle(visual: RoomVisual, x: number, y: number, w: number, h: number, radius: number, style?: PolyStyle): void {
        if (radius * 2 > w || radius * 2 > h)
            return;

        let points = [];
        points.push([x + radius, y]); // top, left
        points.push([x + w - radius, y]); //top, right

        points.push([x + w, y + radius]); // right, top
        points.push([x + w, y + h - radius]); // right, bottom

        points.push([x + w - radius, y + h]); // bottom, right
        points.push([x + radius, y + h]); // bottom, left

        points.push([x, y + h - radius]); // left, bottom
        points.push([x, y + radius]); // left, top

        points.push([x + radius, y]); // top, left
        points.push([x + w - radius, y]); //top, right // extra point to smooth the draw out

        visual.poly(points, style);
    }
}
