import { Entity } from "../entity";
import { GameStateComponent, TetrominoComponent } from "../components";
import type { EventBus } from "../../managers";

export class GameStateSystem {
    private game: GameStateComponent;
    private eventBus: EventBus;

    constructor(entity: Entity, eventBus: EventBus) {
        this.game = entity.getComponent<GameStateComponent>("game")!;
        this.eventBus = eventBus;
    }

    checkGameOver() {
        const limit = 2;
        const over = this.game.grid.some(c => c.row !== null && c.row < limit);

        if (over) {
            if (this.game.soundOn) this.eventBus.emit("gameover");
            if (this.game.raf) cancelAnimationFrame(this.game.raf);
            this.game.raf = null;
            const overlay = document.getElementById("gameover-overlay");
            if (overlay) overlay.style.display = "flex";
            return true;
        }

        return false;
    }

    setGrounded(tetromino: TetrominoComponent) {
        if (this.game.soundOn) this.eventBus.emit("point");

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
        if (this.game.soundOn) this.eventBus.emit("explosion");

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

    setBackground() {
        const app = document.getElementById("app");
        const bg = document.createElement("div");
        bg.setAttribute("id", "bg");

        for (let i = 0; i < 1600; i++) {
            const cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            bg.appendChild(cell);
        }

        if (app) app.appendChild(bg);
    }

    animateBackground() {
        const bg = document.getElementById("bg");
        if (!bg) return;

        const cells = Array.from(bg.children) as HTMLElement[];

        // Убираем класс у всех, кто его уже имеет
        const activeCells = cells.filter(cell => cell.classList.contains("scale-cell"));
        activeCells.forEach(cell => cell.classList.remove("scale-cell"));

        // Берем из оставшихся случайных до 200 элементов и добавляем класс
        const remainingCells = cells.filter(cell => !cell.classList.contains("scale-cell"));
        const count = Math.min(200, remainingCells.length);

        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * remainingCells.length);
            remainingCells[index].classList.add("scale-cell");
            remainingCells.splice(index, 1); // чтобы не выбрать тот же элемент снова
        }
    }

    settingsUi(loop: FrameRequestCallback) {
        // Основной контейнер для очков
        const scoreWrap = document.createElement("div");
        scoreWrap.setAttribute("class", "score-wrap");

        const scoreBlock = document.createElement("div");
        scoreBlock.setAttribute("class", "score-block");

        const scoreLabel = document.createElement("div");
        scoreLabel.setAttribute("class", "score-label");
        scoreLabel.innerText = "Score:";

        const scoreValue = document.createElement("div");
        scoreValue.setAttribute("id", "score");
        scoreValue.innerText = "0";

        scoreBlock.appendChild(scoreLabel);
        scoreBlock.appendChild(scoreValue);

        const buttonsBlock = document.createElement("div");
        buttonsBlock.setAttribute("class", "buttons-block");

        // Пауза
        const pauseBtn = document.createElement("button");
        const block1 = document.createElement("div");
        const block2 = document.createElement("div");
        block1.setAttribute("class", "block1");
        block2.setAttribute("class", "block2");
        pauseBtn.setAttribute("class", "control-btn");
        pauseBtn.appendChild(block1);
        pauseBtn.appendChild(block2);
        pauseBtn.onclick = () => {
            if (this.game.soundOn) this.eventBus.emit("gamestart");

            if (this.game.raf) {
                cancelAnimationFrame(this.game.raf);
                this.game.raf = null;
                block2.classList.add("scale-b-2");

                let t = setTimeout(() => {
                    block1.classList.add("scale-b-1");
                    block2.style.display = "none";
                    clearTimeout(t);
                }, 500);
            } else {
                this.game.current = performance.now();
                this.game.raf = requestAnimationFrame(loop);
                block1.classList.remove("scale-b-1");
                block2.style.display = "block";

                let t = setTimeout(() => {
                    block2.classList.remove("scale-b-2");
                    clearTimeout(t);
                }, 500);
            }
        };

        // Звук
        const soundBtn = document.createElement("button");
        const speaker = document.createElement("span");
        const wave1 = document.createElement("span");
        const wave2 = document.createElement("span");
        const wave3 = document.createElement("span");
        speaker.setAttribute("class", "sound");
        wave1.setAttribute("class", "wave1");
        wave2.setAttribute("class", "wave2");
        wave3.setAttribute("class", "wave3");
        soundBtn.setAttribute("class", "control-btn");
        soundBtn.appendChild(speaker);
        soundBtn.appendChild(wave1);
        soundBtn.appendChild(wave2);
        soundBtn.appendChild(wave3);
        soundBtn.onclick = () => {
            if (this.game.soundOn) this.eventBus.emit("gamestart");

            this.game.soundOn = !this.game.soundOn;

            if (this.game.soundOn) {
                wave1.classList.add("fade-in-sound");
                wave1.classList.remove("fade-out-sound");
                wave2.classList.add("fade-in-sound");
                wave2.classList.remove("fade-out-sound");
                wave3.classList.add("fade-in-sound");
                wave3.classList.remove("fade-out-sound");
            } else {
                wave1.classList.add("fade-out-sound");
                wave1.classList.remove("fade-in-sound");
                wave2.classList.add("fade-out-sound");
                wave2.classList.remove("fade-in-sound");
                wave3.classList.add("fade-out-sound");
                wave3.classList.remove("fade-in-sound");
            }
        };

        buttonsBlock.appendChild(pauseBtn);
        buttonsBlock.appendChild(soundBtn);

        scoreWrap.appendChild(scoreBlock);
        scoreWrap.appendChild(buttonsBlock);
        document.body.appendChild(scoreWrap);

        // === Start overlay ===
        const startOverlay = document.createElement("div");
        startOverlay.id = "start-overlay";
        startOverlay.className = "overlay";
        startOverlay.innerHTML = `<h1 class="fade-in">Tetris</h1><button class="fade-in delay" id="start-btn">Start</button>`;
        document.body.appendChild(startOverlay);
        startOverlay.style.display = "flex"; // виден только стартовый экран

        const startBtn = document.getElementById("start-btn")!;
        startBtn.onclick = () => {
            if (this.game.soundOn) this.eventBus.emit("gamestart");
            startOverlay.style.display = "none";
            this.game.current = performance.now();
            this.game.raf = requestAnimationFrame(loop);
        };

        // === Game over overlay ===
        const gameOverOverlay = document.createElement("div");
        gameOverOverlay.id = "gameover-overlay";
        gameOverOverlay.className = "overlay";
        gameOverOverlay.innerHTML = `<h1 class="fade-in">Game Over</h1><button class="fade-in delay" id="restart-btn">Restart</button>`;
        document.body.appendChild(gameOverOverlay);
        gameOverOverlay.style.display = "none"; // скрыт по умолчанию

        const restartBtn = document.getElementById("restart-btn")!;
        restartBtn.onclick = () => {
            if (this.game.soundOn) this.eventBus.emit("gamestart");
            document.getElementById("score")!.innerText = "0";
            gameOverOverlay.style.display = "none";
            this.game.grid = [];
            this.game.current = performance.now();
            this.game.raf = requestAnimationFrame(loop);
        };
    }
}
