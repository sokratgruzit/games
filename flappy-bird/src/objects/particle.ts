export class Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    color: string;
    gameSpeed: number;

    constructor(x: number, y: number, color: string, gameSpeed: number) {
        this.x = x;
        this.y = y + 20;
        this.size = Math.random() * 7 + 3;
        this.speedY = (Math.random() * 1) - 0.5;
        this.color = color;
        this.gameSpeed = gameSpeed;
    }

    update() {
        this.x -= this.gameSpeed;
        this.y += this.speedY;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    setGameSpeed(speed: number) {
        this.gameSpeed = speed;
    }
}
