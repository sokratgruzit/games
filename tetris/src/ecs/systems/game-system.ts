import { Entity } from "../entity";
import { GameStateComponent, TetrominoComponent } from "../components";

export class GameStateSystem {
    private game: GameStateComponent;

    constructor(entity: Entity) {
        this.game = entity.getComponent<GameStateComponent>("game")!;
    }

    checkGameOver() {
        const limit = 2;
        const over = this.game.grid.some(c => c.row !== null && c.row < limit);

        if (over) {
            if (this.game.raf) cancelAnimationFrame(this.game.raf);
            this.game.raf = null;
            const overlay = document.getElementById("gameover-overlay");
            if (overlay) overlay.style.display = "flex";
            return true;
        }

        return false;
    }

    setGrounded(tetromino: TetrominoComponent) {
        const cellSize = tetromino.cells[0].width;

        for (const c of tetromino.cells) {
            const snappedX = Math.round(c.targetX / cellSize) * cellSize;
            const snappedY = Math.round(c.targetY / cellSize) * cellSize;

            c.targetX = snappedX;
            c.targetY = snappedY;
            c.x = snappedX;
            c.y = snappedY;
            (c as any).grounded = true;
            c.row = snappedY / cellSize;

            this.game.grid.push({ ...c });
        }
    }

    addScore(points: number) {
        const scoreEl = document.getElementById("score");
        if (!scoreEl) return;

        const current = this.game.score;
        const target = current + points;
        let displayed = current;

        const increment = () => {
            if (displayed < target) {
                displayed++;
                scoreEl.innerText = displayed.toString();

                const flash = document.createElement("span");
                flash.className = "score-flash";
                flash.innerText = "+1";
                scoreEl.appendChild(flash);

                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = -20 - Math.random() * 10;
                flash.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;
                flash.style.opacity = "1";

                setTimeout(() => {
                    flash.style.transform = `translate(${offsetX}px, ${offsetY - 10}px) scale(1.5)`;
                    flash.style.opacity = "0";
                }, 20);

                setTimeout(() => flash.remove(), 400);
                requestAnimationFrame(increment);
            }
        };

        increment();
        this.game.score = target;
    }

    clearFullLines(tetromino: TetrominoComponent, canvas: HTMLCanvasElement) {
        const cellSize = tetromino.cells[0].width;
        const colsCount = canvas.width / cellSize;

        let row = 0;
        while (row * cellSize < canvas.height) {
            const cellsInRow = this.game.grid.filter(c => c.row === row && (c as any).grounded);

            if (cellsInRow.length >= colsCount) {
                this.game.grid = this.game.grid.filter(c => c.row !== row);
                this.addScore(10);

                for (const c of this.game.grid) {
                    if (c.row !== null && c.row < row) {
                        c.row += 1;
                        c.targetY += cellSize;

                        if (typeof (c as any).startWave === 'function') {
                            (c as any).startWave();
                        } else {
                            const originalY = c.y;
                            const targetY = c.targetY;
                            let phase = 0;
                            const waveAnimation = () => {
                                phase += 0.2;
                                c.y = originalY + (targetY - originalY) * (1 - Math.cos(phase)) / 2;
                                if (phase < Math.PI) requestAnimationFrame(waveAnimation);
                                else c.y = targetY;
                            };
                            waveAnimation();
                        }
                    }
                }

                continue;
            }

            row++;
        }
    }
}
