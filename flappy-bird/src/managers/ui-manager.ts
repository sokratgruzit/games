import { GameStateComponent } from "../ecs/components";
import type { Entity } from "../ecs/entity";

export class UIManager {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private gameState: Entity;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, gameState: Entity) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.gameState = gameState;
    }

    /** Вызывается напрямую из GameController при отрисовке кадра */
    public render() {
        const game = this.gameState.getComponent<GameStateComponent>("game");

        this.drawScore(game?.score || 0);

        if (game?.paused && !game?.gameOver) {
            this.drawPauseText();
        }

        if (game?.gameOver) {
            this.drawGameOverText();
        }
    }

    private drawScore(score: number) {
        this.ctx.save();
        this.ctx.font = "bold 24px sans-serif";
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 4;
        const text = `Score: ${score}`;
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
