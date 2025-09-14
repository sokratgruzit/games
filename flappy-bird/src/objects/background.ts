export class Background {
    canvasWidth: number;
    canvasHeight: number;

    private layers: {
        img: HTMLImageElement;
        speedFactor: number;
        x: number;
        y: number;
    }[];

    private moon: {
        img: HTMLImageElement;
        speedFactor: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.layers = [
            { img: this.loadImage("assets/sprites/far-bg.png"), speedFactor: 0.05, x: 0, y: -60 },   // дальний выше
            { img: this.loadImage("assets/sprites/middle-bg.png"), speedFactor: 0.1, x: 0, y: -40 }, // средний чуть выше
            { img: this.loadImage("assets/sprites/near-bg.png"), speedFactor: 0.3, x: 0, y: 0 },     // ближний внизу
        ];

        this.moon = {
            img: this.loadImage("assets/sprites/moon.png"),
            speedFactor: 0.05,
            x: this.canvasWidth,
            y: 30, // фиксированно сверху
            width: 80,
            height: 80,
        };
    }

    private loadImage(src: string): HTMLImageElement {
        const img = new Image();
        img.src = src;
        return img;
    }

    update(gameSpeed: number) {
        for (let layer of this.layers) {
            layer.x -= gameSpeed * layer.speedFactor;
            if (layer.x <= -this.canvasWidth) {
                layer.x = 0;
            }
        }

        this.moon.x -= gameSpeed * this.moon.speedFactor;
        if (this.moon.x + this.moon.width <= 0) {
            this.moon.x = this.canvasWidth;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.drawGradient(ctx);
        
        for (let layer of this.layers) {
            ctx.drawImage(layer.img, layer.x, layer.y, this.canvasWidth, this.canvasHeight);
            ctx.drawImage(layer.img, layer.x + this.canvasWidth, layer.y, this.canvasWidth, this.canvasHeight);
        }

        ctx.drawImage(
            this.moon.img,
            this.moon.x,
            this.moon.y,
            this.moon.width,
            this.moon.height
        );
    }

    drawGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, "rgba(200, 0, 0, 0.7)");   // насыщенный красный сверху
        gradient.addColorStop(0.5, "rgba(255, 100, 50, 0.4)"); // оранжево-кровавый в середине
        gradient.addColorStop(1, "rgba(255, 200, 150, 0.2)"); // бледный розово-оранжевый снизу

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}
