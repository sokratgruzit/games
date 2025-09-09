import { Rectangle2D } from "./rectangle";

export class Platform extends Rectangle2D {
    color: string;
    velocity_x: number;
    velocity_y: number;
    move_force: number;
    grounded: boolean;

    constructor(
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        color: string
    ) {
        super(x, y, width, height);
        this.color = color;
        this.velocity_y = 0;
        this.velocity_x = 0;
        this.move_force = Math.random() * 1 + 1;
        this.grounded = false;
    }

    moveUp() {
        this.moveY(-this.move_force);
    }
}