import { Rectangle2D } from "./rectangle";

export class Ground extends Rectangle2D {
    color: string;
    image?: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, color: string) {
        super(x, y, width, height);
        this.color = color;

        this.image = new Image();
        this.image.src = "/assets/ground-stay-down.png";
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
