import { Rectangle2D } from "./rectangle";

export class Item extends Rectangle2D {
    color: string;

    constructor(
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        color: string
    ) {
        super(x, y, width, height);
        this.color = color;
    }
}