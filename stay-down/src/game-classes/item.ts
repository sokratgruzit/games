import { Rectangle2D } from "./rectangle";
import { AnimatedSprite } from "./animated-sprite";

export class Item extends Rectangle2D {
    color: string;
    sprite?: AnimatedSprite;
    floatTime: number;
    floatAmplitude: number;
    floatSpeed: number;
    floatPhase: number;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        sprite?: AnimatedSprite
    ) {
        super(x, y, width, height);
        this.color = color;
        this.sprite = sprite;

        this.floatTime = Math.random() * Math.PI * 2;
        this.floatAmplitude = 3 + Math.random() * 5;
        this.floatSpeed = 0.02 + Math.random() * 0.05;
        this.floatPhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.floatTime += this.floatSpeed;
        if (this.sprite) {
            this.sprite.update();
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        const offsetY = Math.sin(this.floatTime + this.floatPhase) * this.floatAmplitude;

        if (this.sprite) {
            this.sprite.render(ctx, this.x, this.y + offsetY, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y + offsetY, this.width, this.height);
        }
    }
}
