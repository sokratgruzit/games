import { Rectangle2D } from "./rectangle";

export class Player extends Rectangle2D {
    color: string;
    velocity_x: number;
    velocity_y: number;
    move_force: number;
    jump_force: number;
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
        this.move_force = 1;
        this.jump_force = 16;
        this.grounded = false;
    }

    ground() {
        this.grounded = true;
        this.velocity_y = 0;
    }

    jump() {
        if (this.grounded) {
            this.grounded = false;
            this.velocity_y -= this.jump_force;
        }
    }

    moveLeft() {
        this.velocity_x -= this.move_force;
    }

    moveRight() {
        this.velocity_x += this.move_force;
    }

    updatePosition(gravity: number, friction: number) {
        this.old_y = this.y;
        
        this.velocity_y += gravity;

        this.moveY(this.velocity_y);
        this.x += this.velocity_x;
        
        this.velocity_y *= friction;
        this.velocity_x *= friction;
    }
}