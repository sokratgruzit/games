import { Controls } from "./controls";

import { createTetrominoEntity, createGameEntity } from "./ecs/entities";
import { Entity } from "./ecs/entity";
import { RenderSystem } from "./ecs/systems/render-system";
import { PhysicsSystem } from "./ecs/systems/physics-system";
import { CollisionSystem } from "./ecs/systems/collision-system";
import { GameStateSystem } from "./ecs/systems/game-system";

import type { GameStateComponent, TetrominoComponent } from "./ecs/components";

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    tetromino: Entity;
    gameState: Entity;
    controls: Controls;
    private entityIdCounter = 1;
    private renderSystem: RenderSystem;
    private physicsSystem: PhysicsSystem;
    private collisionSystem: CollisionSystem;
    private gameStateSystem: GameStateSystem;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.collisionSystem = new CollisionSystem();
        this.controls = new Controls();
        this.renderSystem = new RenderSystem(this.ctx);
        this.physicsSystem = new PhysicsSystem();
        this.tetromino = createTetrominoEntity(this.entityIdCounter++, "line");
        this.gameState = createGameEntity(this.entityIdCounter++);
        this.gameStateSystem = new GameStateSystem(this.gameState);
    }

    loop = (timeStamp: number) => {
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (gameComponent) {
            let updated = false;
            const elapsed = timeStamp - gameComponent.current;
            gameComponent.accumulated += elapsed;
            gameComponent.current = timeStamp;
    
            if (gameComponent.accumulated > 1000) gameComponent.accumulated = gameComponent.timeStep;
    
            while (gameComponent.accumulated >= gameComponent.timeStep) {
                this.update();
                gameComponent.accumulated -= gameComponent.timeStep;
                updated = true;
            }
    
            if (updated) this.render();
    
            if (gameComponent.raf) gameComponent.raf = window.requestAnimationFrame(this.loop);
        }
    }

    update = () => {
        const tetrominoComponent = this.tetromino.getComponent<TetrominoComponent>("tetromino");
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (tetrominoComponent && gameComponent) {
            gameComponent.weight = this.controls.isPressed("ArrowDown") ? 3 : 1;
            const step = gameComponent.weight;
            this.physicsSystem.findPivot(tetrominoComponent);
            const hitFloor = this.collisionSystem.groundCollision(tetrominoComponent.cells, this.canvas);
            const hitBlocks = this.collisionSystem.blockCollision(tetrominoComponent.cells, gameComponent.grid, step);

            if (hitFloor || hitBlocks) {
                this.gameStateSystem.setGrounded(tetrominoComponent);
        
                this.gameStateSystem.clearFullLines(tetrominoComponent, this.canvas);

                if (this.gameStateSystem.checkGameOver()) return;

                this.tetromino = createTetrominoEntity(this.entityIdCounter++, "line");
                return;
            }

            if (this.controls.wasJustPressed("ArrowLeft")) {
                if (
                    !this.collisionSystem.wallCollision(tetrominoComponent.cells, this.canvas, "left") &&
                    !this.collisionSystem.horizontalBlockCollision(tetrominoComponent.cells, gameComponent.grid, "left", step)
                ) {
                    this.physicsSystem.moveHorizontalBy(-gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }

            if (this.controls.wasJustPressed("ArrowRight")) {
                if (
                    !this.collisionSystem.wallCollision(tetrominoComponent.cells, this.canvas, "right") &&
                    !this.collisionSystem.horizontalBlockCollision(tetrominoComponent.cells, gameComponent.grid, "right", step)
                ) {
                    this.physicsSystem.moveHorizontalBy(gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }

            if (this.controls.wasJustPressed("KeyA") || this.controls.wasJustPressed("KeyD")) {
                const dir = this.controls.wasJustPressed("KeyA") ? "left" : "right";

                const collidesWall = tetrominoComponent.cells.some(c => c.targetX < 0 || c.targetX + c.width > this.canvas.width);
                const collidesFloor = tetrominoComponent.cells.some(c => c.targetY + c.height > this.canvas.height);
                const collidesBlocks = this.collisionSystem.blockCollision(tetrominoComponent.cells, gameComponent.grid, 0);

                if (!collidesWall && !collidesFloor && !collidesBlocks) {
                    for (let cell of tetrominoComponent.cells) this.physicsSystem.rotate(cell, dir, tetrominoComponent.pivot);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }
        
            for (let cell of tetrominoComponent.cells) {
                if (cell.targetX > this.canvas.width) {
                    this.physicsSystem.moveHorizontalBy(-gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
                if (cell.targetX < 0) {
                    this.physicsSystem.moveHorizontalBy(gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }

            this.physicsSystem.update([
                this.tetromino
            ], this.canvas, step);
        }
    };

    render = () => {
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (gameComponent) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderSystem.render([this.tetromino], gameComponent.grid);
        }
    }

    start() {
        this.settingsUi();
    }

    startGame() {
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (gameComponent) {
            gameComponent.grid = [];
            this.tetromino = createTetrominoEntity(this.entityIdCounter++, "line");
            gameComponent.current = performance.now();
            if (gameComponent.raf) cancelAnimationFrame(gameComponent.raf);
            gameComponent.raf = requestAnimationFrame(this.loop);
    
            const scoreEl = document.getElementById("score");
            if (scoreEl) scoreEl.innerText = "0";
    
            const startOverlay = document.getElementById("start-overlay");
            if (startOverlay) startOverlay.style.display = "none";
    
            const gameOverOverlay = document.getElementById("gameover-overlay");
            if (gameOverOverlay) gameOverOverlay.style.display = "none";
        }
    }

    togglePause(button: HTMLButtonElement) {
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (gameComponent) {
            if (gameComponent.raf) {
                cancelAnimationFrame(gameComponent.raf);
                gameComponent.raf = null;
                button.innerText = "▶";
            } else {
                gameComponent.current = performance.now();
                gameComponent.raf = requestAnimationFrame(this.loop);
                button.innerText = "⏸";
            }
        }
    }

    settingsUi() {
        const gameComponent = this.gameState.getComponent<GameStateComponent>("game");

        if (gameComponent) {
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
            pauseBtn.setAttribute("class", "control-btn pause-btn");
            pauseBtn.innerText = "⏸";
            pauseBtn.onclick = () => {
                if (gameComponent.raf) {
                    cancelAnimationFrame(gameComponent.raf);
                    gameComponent.raf = null;
                    pauseBtn.innerText = "▶";
                } else {
                    gameComponent.current = performance.now();
                    gameComponent.raf = requestAnimationFrame(this.loop);
                    pauseBtn.innerText = "⏸";
                }
            };
    
            // Звук
            const soundBtn = document.createElement("button");
            soundBtn.setAttribute("class", "control-btn sound-btn");
            soundBtn.innerText = "🔊";
            let soundOn = true;
            soundBtn.onclick = () => {
                soundOn = !soundOn;
                soundBtn.innerText = soundOn ? "🔊" : "🔇";
                // можно управлять this.soundEnabled = soundOn
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
            startOverlay.innerHTML = `<h1>Tetris</h1><button id="start-btn">Start</button>`;
            document.body.appendChild(startOverlay);
            startOverlay.style.display = "flex"; // виден только стартовый экран
    
            const startBtn = document.getElementById("start-btn")!;
            startBtn.onclick = () => {
                startOverlay.style.display = "none";
                gameComponent.current = performance.now();
                gameComponent.raf = requestAnimationFrame(this.loop);
            };
    
            // === Game over overlay ===
            const gameOverOverlay = document.createElement("div");
            gameOverOverlay.id = "gameover-overlay";
            gameOverOverlay.className = "overlay";
            gameOverOverlay.innerHTML = `<h1>Game Over</h1><button id="restart-btn">Restart</button>`;
            document.body.appendChild(gameOverOverlay);
            gameOverOverlay.style.display = "none"; // скрыт по умолчанию
    
            const restartBtn = document.getElementById("restart-btn")!;
            restartBtn.onclick = () => {
                gameOverOverlay.style.display = "none";
                gameComponent.grid = [];
                this.tetromino = createTetrominoEntity(this.entityIdCounter++, "line");
                document.getElementById("score")!.innerText = "0";
                gameComponent.current = performance.now();
                gameComponent.raf = requestAnimationFrame(this.loop);
            };
        }
    }
}
