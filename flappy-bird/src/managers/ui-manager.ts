import { EventBus } from "./event-bus";

export class UIManager {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private score: number = 0;
    private paused: boolean = false;
    private gameOver: boolean = false;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, eventBus: EventBus) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        // Подписки на события
        eventBus.on("scoreIncrease", () => {
            this.score++;
        });

        eventBus.on("pauseToggled", () => {
            this.paused = !this.paused;
        });

        eventBus.on("restartGame", () => {
            this.reset();
        });

        eventBus.on("gameOver", () => {
            this.gameOver = true;
        });
    }

    private reset() {
        this.score = 0;
        this.paused = false;
        this.gameOver = false;
    }

    /** Вызывается напрямую из GameController при отрисовке кадра */
    public render() {
        this.drawScore();
        if (this.paused && !this.gameOver) {
            this.drawPauseText();
        }
        if (this.gameOver) {
            this.drawGameOverText();
        }
    }

    private drawScore() {
        this.ctx.save();
        this.ctx.font = "bold 24px sans-serif";
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 4;
        const text = `Score: ${this.score}`;
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        this.ctx.strokeText(text, this.width - 20, 20);
        this.ctx.fillText(text, this.width - 20, 20);
        this.ctx.restore();
    }

    private drawPauseText() {
        this.ctx.save();
        this.ctx.font = "bold 64px sans-serif";
        this.ctx.fillStyle = "yellow";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 6;
        const text = "Paused";
        const x = this.width / 2;
        const y = this.height / 2;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    private drawGameOverText() {
        this.ctx.save();
        this.ctx.font = "bold 64px sans-serif";
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 6;
        const text = "Game Over";
        const x = this.width / 2;
        const y = this.height / 2;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }
}
