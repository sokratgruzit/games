import { EventBus } from "../managers/event-bus";

export class Obstacle {
    top: number;
    bottom: number;
    x: number;
    width: number;
    color: string;
    gameSpeed: number;
    counted: boolean;
    canvasWidth: number;
    canvasHeight: number;
    private eventBus?: EventBus; // EventBus опционально

    constructor(canvasWidth: number, canvasHeight: number, color: string, eventBus?: EventBus) {
        this.top = (Math.random() * canvasHeight / 3) + 20;
        this.bottom = (Math.random() * canvasHeight / 3) + 20;
        this.x = canvasWidth;
        this.width = 20;
        this.color = color;
        this.gameSpeed = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.counted = false;
        this.eventBus = eventBus;
    }

    update() {
        this.x -= this.gameSpeed;

        // Если птица прошла препятствие и ещё не засчитано — эмитим событие
        if (!this.counted && this.eventBus && this.x + this.width < 150) { // 150 — x птицы
            this.counted = true;
            this.eventBus.emit("scoreIncrease");
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, this.canvasHeight - this.bottom, this.width, this.bottom);
    }

    setGameSpeed(speed: number) {
        this.gameSpeed = speed;
    }

    setCounted(counted: boolean) {
        this.counted = counted;
    }
}
