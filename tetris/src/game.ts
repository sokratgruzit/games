import { Entity } from "./ecs/entity";

import { 
    createTetrominoEntity, 
    createGameEntity 
} from "./ecs/entities";

import { 
    RenderSystem, 
    PhysicsSystem, 
    CollisionSystem, 
    GameStateSystem,
    ControlsSystem
} from "./ecs/systems";

import { EventBus } from "./managers"

import type { 
    GameStateComponent, 
    TetrominoComponent 
} from "./ecs/components";

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    tetromino: Entity | null;
    gameState: Entity;
    controls: ControlsSystem;
    private entityIdCounter = 1;
    private renderSystem: RenderSystem;
    private physicsSystem: PhysicsSystem;
    private collisionSystem: CollisionSystem;
    private gameStateSystem: GameStateSystem;
    private eventBus: EventBus;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.tetromino = null;
        this.canvas = canvas;
        this.ctx = ctx;
        this.eventBus = new EventBus();
        this.collisionSystem = new CollisionSystem();
        this.controls = new ControlsSystem();
        this.renderSystem = new RenderSystem(this.ctx);
        this.physicsSystem = new PhysicsSystem();
        this.gameState = createGameEntity(this.entityIdCounter++);
        this.gameStateSystem = new GameStateSystem(this.gameState, this.eventBus);

        this.randomizer();
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

                gameComponent.lastBgAnimation += gameComponent.timeStep;

                if (gameComponent.lastBgAnimation > 5000) {
                    this.gameStateSystem.animateBackground();
                    gameComponent.lastBgAnimation = 0;
                }
            }
    
            if (updated) this.render();
    
            if (gameComponent.raf) gameComponent.raf = window.requestAnimationFrame(this.loop);
        }
    }

    update = () => {
        if (!this.tetromino) return;

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

                this.randomizer();
                return;
            }

            if (this.controls.wasJustPressed("ArrowLeft")) {
                if (gameComponent.soundOn) this.eventBus.emit("rotate");

                if (
                    !this.collisionSystem.wallCollision(tetrominoComponent.cells, this.canvas, "left") &&
                    !this.collisionSystem.horizontalBlockCollision(tetrominoComponent.cells, gameComponent.grid, "left", step)
                ) {
                    this.physicsSystem.moveHorizontalBy(-gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }

            if (this.controls.wasJustPressed("ArrowRight")) {
                if (gameComponent.soundOn) this.eventBus.emit("rotate");

                if (
                    !this.collisionSystem.wallCollision(tetrominoComponent.cells, this.canvas, "right") &&
                    !this.collisionSystem.horizontalBlockCollision(tetrominoComponent.cells, gameComponent.grid, "right", step)
                ) {
                    this.physicsSystem.moveHorizontalBy(gameComponent.velocity, this.canvas, tetrominoComponent);
                    this.physicsSystem.startWave(150, tetrominoComponent);
                }
            }

            if (this.controls.wasJustPressed("KeyA") || this.controls.wasJustPressed("KeyD")) {
                if (gameComponent.soundOn) this.eventBus.emit("rotate");

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

        if (gameComponent && this.tetromino) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderSystem.render([this.tetromino], gameComponent.grid);
        }
    }

    randomizer = () => {
        const types = ["line", "square", "z", "l", "s", "j"];
        const random = Math.round(Math.random() * 5);
        const type = types[random];
        
        this.tetromino = createTetrominoEntity(this.entityIdCounter++, type);
    }

    start() {
        this.randomizer();
        this.gameStateSystem.settingsUi(this.loop);
        this.gameStateSystem.setBackground();
    }
}
