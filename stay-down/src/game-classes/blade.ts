import { Rectangle2D } from "./rectangle";

export class Blade extends Rectangle2D {
    color: string;
    image?: HTMLImageElement;
    floatTime: number;
    floatAmplitude: number;
    floatSpeed: number;
    floatPhase: number;

    // новые поля для вращения
    rotation: number;
    rotationSpeed: number;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
    ) {
        super(x, y, width, height);
        this.color = color;
        this.image = new Image();
        this.image.src = "/assets/blade-stay-down.png";

        this.floatTime = Math.random() * Math.PI * 2;
        this.floatAmplitude = 3 + Math.random() * 5;
        this.floatSpeed = 0.02 + Math.random() * 0.05;
        this.floatPhase = Math.random() * Math.PI * 2;

        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = 0.05 + Math.random() * 0.1;
    }

    update() {
        this.floatTime += this.floatSpeed;
        this.rotation += this.rotationSpeed;
        this.rotation %= 2 * Math.PI;
    }

    render(ctx: CanvasRenderingContext2D) {
        const offsetY = Math.sin(this.floatTime + this.floatPhase) * this.floatAmplitude;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + offsetY + this.height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        if (this.image) {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
}
