import { Rectangle2D } from "./rectangle";

export class Platform extends Rectangle2D {
    color: string;
    move_force: number;
    image?: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, color: string, image?: HTMLImageElement) {
        super(x, y, width, height);
        this.color = color;
        this.move_force = Math.random() * 1 + 1;
        this.image = image;
    }

    moveUp() {
        this.moveY(-this.move_force);
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.image) {
            // рисуем картинку 100x100, визуально над хитбоксом
            ctx.drawImage(this.image, this.x, this.y - 25, 80, 60);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
