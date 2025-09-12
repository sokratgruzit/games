import { Rectangle2D } from "./rectangle";
import { AnimatedSprite } from "./animated-sprite";
import { WORLD_WIDTH } from "../constants";

export class Player extends Rectangle2D {
    color: string;
    velocity_x: number;
    velocity_y: number;
    move_force: number;
    jump_force: number;
    grounded: boolean;

    idleSprite: AnimatedSprite;
    runSprite: AnimatedSprite;
    jumpSprite: AnimatedSprite;
    slideSprite: AnimatedSprite; // новый спрайт для слайда
    sprite: AnimatedSprite;

    sliding: boolean = false;
    slideDirection: number = 0;
    slideTimer: number = 0;
    slideDuration: number = 20; // продолжительность слайда в кадрах

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        idleSprite: AnimatedSprite,
        runSprite: AnimatedSprite,
        jumpSprite: AnimatedSprite,
        slideSprite: AnimatedSprite
    ) {
        super(x, y, width, height);
        this.color = color;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.move_force = 1;
        this.jump_force = 16;
        this.grounded = false;

        this.idleSprite = idleSprite;
        this.runSprite = runSprite;
        this.jumpSprite = jumpSprite;
        this.slideSprite = slideSprite;
        this.sprite = idleSprite; // по умолчанию idle
    }

    ground() {
        this.grounded = true;
        this.velocity_y = 0;
    }

    jump() {
        if (this.grounded) {
            this.grounded = false;
            this.velocity_y -= this.jump_force;
            this.sprite = this.jumpSprite;
        }
    }

    moveLeft() {
        this.velocity_x -= this.move_force;
    }

    moveRight() {
        this.velocity_x += this.move_force;
    }

    slide(direction: number) {
        if (!this.grounded) return; // слайд только по земле
        this.sliding = true;
        this.slideDirection = direction;
        this.slideTimer = this.slideDuration;
        this.velocity_x = 5 * direction; // стартовая скорость слайда
        this.sprite = this.slideSprite;
    }

    updatePosition(gravity: number, friction: number) {
        this.old_y = this.y;

        this.velocity_y += gravity;
        this.moveY(this.velocity_y);
        this.x += this.velocity_x;

        if (this.x < -this.width) this.x = WORLD_WIDTH + this.width;
        if (this.x > WORLD_WIDTH + this.width) this.x = -this.width;

        // торможение
        if (!this.sliding) {
            this.velocity_x *= friction;
        } else {
            this.slideTimer--;
            if (this.slideTimer <= 0) this.sliding = false;
        }

        // выбор спрайта
        if (!this.grounded) {
            this.sprite = this.jumpSprite;
        } else if (this.sliding) {
            this.sprite = this.slideSprite;
        } else if (Math.abs(this.velocity_x) > 0.1) {
            this.sprite = this.runSprite;
        } else {
            this.sprite = this.idleSprite;
        }

        this.sprite.update();
    }

    render(ctx: CanvasRenderingContext2D) {
        const flip = this.velocity_x < 0; // если движется влево
        const width = this.width;
        const height = this.height;

        ctx.save();
        if (flip) {
            ctx.translate(this.x + width, this.y);
            ctx.scale(-1, 1);
            this.sprite.render(ctx, 0, 0, width, height);
        } else {
            this.sprite.render(ctx, this.x, this.y, width, height);
        }
        ctx.restore();
    }
}

