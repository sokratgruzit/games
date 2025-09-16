import { 
    PhysicsSystem, 
    RenderSystem, 
    CollisionSystem, 
    AnimationSystem, 
    InputSystem,
    GameStateSystem
} from "./ecs/systems";
import { 
    createBirdEntity, 
    createGameEntity,
    createExplosionEntity,
    createMoonEntity,
    createImageEntity,
    createGradientEntity
} from "./ecs/entities";
import { 
    BirdComponent, 
    InputComponent, 
    PositionComponent, 
    SpriteComponent, 
    GameStateComponent
} from "./ecs/components";
import { GameEngine } from "./engine";
import { ParticleManager } from "./managers/particle-manager";
import { ObstacleManager } from "./managers/obstacle-manager";
import { InputManager } from "./managers/input-manager";
import { SoundManager } from "./managers/sound-manager";
import { EventBus } from "./managers/event-bus";
import { UIManager } from "./managers/ui-manager";

import birdJson from "./sprite-data/dragon.json";
import explosionJson from "./sprite-data/explosion.json";
import { Entity } from "./ecs/entity";

export class GameController {
    private ctx: CanvasRenderingContext2D;
    private explosions: Entity[];
    private engine: GameEngine;
    private width: number;
    private height: number;
    private particleManager: ParticleManager;
    private obstacleManager: ObstacleManager;
    private inputManager: InputManager;
    private eventBus: EventBus;

    uiManager: UIManager;
    soundManager: SoundManager;

    private entityIdCounter = 1;
    private physicsSystem: PhysicsSystem;
    private renderSystem: RenderSystem;
    private collisionSystem: CollisionSystem;
    private animationSystem: AnimationSystem;
    private inputSystem: InputSystem;
    private gameSystem: GameStateSystem;

    private birdEntity: Entity;
    private gameEntity: Entity;
    private moonEntity: Entity;
    private imageEntity1: Entity;
    private imageEntity2: Entity;
    private imageEntity3: Entity;
    private gradientEntity: Entity;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        this.gameEntity = createGameEntity(this.entityIdCounter++);
        this.birdEntity = createBirdEntity(this.entityIdCounter++, width, height, birdJson, 0.1, "bird");
        this.moonEntity = createMoonEntity(this.entityIdCounter++, width, height, "assets/sprites/moon.png", "moon");
        this.imageEntity1 = createImageEntity(this.entityIdCounter++, 0, -60, 0.05, width, height, width, height, "assets/sprites/far-bg.png", "image");
        this.imageEntity2 = createImageEntity(this.entityIdCounter++, 0, -40, 0.1, width, height, width, height, "assets/sprites/middle-bg.png", "image");
        this.imageEntity3 = createImageEntity(this.entityIdCounter++, 0, 0, 0.3, width, height, width, height, "assets/sprites/near-bg.png", "image");
        this.gradientEntity = createGradientEntity(this.entityIdCounter++, width, height, [
            { stop: 0, color: "rgba(200, 0, 0, 0.7)" },
            { stop: 0.5, color: "rgba(255, 100, 50, 0.4)" },
            { stop: 1, color: "rgba(255, 200, 150, 0.2)" },
        ], "gradient");

        this.eventBus = new EventBus();
        this.physicsSystem = new PhysicsSystem();
        this.renderSystem = new RenderSystem(this.ctx);
        this.collisionSystem = new CollisionSystem(this.eventBus, this.height);
        this.animationSystem = new AnimationSystem();
        this.inputManager = new InputManager();
        this.inputSystem = new InputSystem(this.inputManager);
        this.gameSystem = new GameStateSystem(this.gameEntity, this.eventBus);

        this.particleManager = new ParticleManager();
        this.obstacleManager = new ObstacleManager();

        this.soundManager = new SoundManager(this.eventBus);
        this.uiManager = new UIManager(this.ctx, this.width, this.height, this.gameEntity);
        this.explosions = [];

        this.eventBus.on("birdCollision", (x: number, y: number) => {
            const explosionEntity1 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 1, "explosion");
            const explosionEntity2 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 1.5, "explosion");
            const explosionEntity3 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 2, "explosion");
            this.explosions.push(explosionEntity1);
            this.explosions.push(explosionEntity2);
            this.explosions.push(explosionEntity3);
       
            this.eventBus.emit("explosionPlay", { x, y, index: 0 });
        });

        this.eventBus.on("explosionPlay", ({ x, y, index }) => {
            const explosionEntity = this.explosions[index];
            if (!explosionEntity) return;

            this.gameSystem.explode(explosionEntity, x, y);
        });

        this.eventBus.on("explosionFinished", () => {
            const game = this.gameEntity.getComponent<GameStateComponent>("game");
            
            if (game && game.currentExplosionIndex < this.explosions.length) {
                const pos = this.birdEntity.getComponent<PositionComponent>("position");

                if (pos) {
                    this.eventBus.emit("explosionPlay", { x: pos.x, y: pos.y, index: game.currentExplosionIndex });
                }
            }
        });

        this.eventBus.on("restartGame", () => {
            this.restartGame();
        });

        this.eventBus.on("scoreIncrease", () => {
            this.soundManager.play("particles");
        });

        this.engine = new GameEngine(this.update, this.render);
    }

    start() {
        this.engine.start();
        this.eventBus.emit("gameStart");
    }

    stop() {
        this.engine.stop();
    }

    private restartGame() {
        this.eventBus.emit("gameStart");
        this.birdEntity = createBirdEntity(this.entityIdCounter++, this.width, this.height, birdJson, 0.1, "bird");
        this.particleManager.clear();
        this.obstacleManager.clear();
    }

    private update = (_dt: number) => {
        const birdInput  = this.birdEntity.getComponent<InputComponent>("input");
        const gameInput = this.gameEntity.getComponent<InputComponent>("input");
        const gameState = this.gameEntity.getComponent<GameStateComponent>("game");

        if (birdInput) this.inputSystem.update(birdInput, "bird");
        if (gameInput) this.inputSystem.update(gameInput, "game");

        this.gameSystem.update();

        if (gameState?.paused) return;
        if (gameState?.gameOver && gameState?.currentExplosionIndex >= this.explosions.length) {
            this.eventBus.emit("gameOver");
            return;
        }

        if (!gameState?.gameOver) {
            const sprite = this.birdEntity.getComponent<SpriteComponent>("sprite");
            const bird = this.birdEntity.getComponent<BirdComponent>("bird");
            const input = this.birdEntity.getComponent<InputComponent>("input");

            if (sprite && bird && input) this.animationSystem.update(sprite, bird, input);

            this.physicsSystem.update([
                this.birdEntity, 
                ...this.obstacleManager.entities, 
                ...this.particleManager.entities, 
                ...this.explosions, 
                this.moonEntity,
                this.imageEntity1,
                this.imageEntity2,
                this.imageEntity3
            ], this.eventBus, _dt);

            this.collisionSystem.collisions(this.birdEntity, this.obstacleManager.entities);
        } else {
            this.physicsSystem.update([...this.explosions, this.imageEntity1, this.imageEntity2, this.imageEntity3], this.eventBus, _dt);
        }
            
        const birdPos = this.birdEntity.getComponent<PositionComponent>("position");

        if (birdPos) {
            this.particleManager.generate(
                birdPos.x, 
                birdPos.y, 
                `hsla(${gameState?.hue}, 100%, 50%, 0.8)`
            );
        }

        this.obstacleManager.generate(
            this.width,
            this.height,
            `hsla(${gameState?.hue}, 100%, 50%, 0.8)`,
            gameState?.frame || 0,
            20
        );
    };

    private render = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const gameState = this.gameEntity.getComponent<GameStateComponent>("game");

        if (this.gradientEntity) {
            let drawObjects: Entity[] = [this.gradientEntity, this.imageEntity1, this.imageEntity2, this.imageEntity3, this.moonEntity, ...this.explosions];
    
            if (!gameState?.gameOver) {
                drawObjects = [this.gradientEntity, this.imageEntity1, this.imageEntity2, this.imageEntity3, ...this.obstacleManager.entities, ...this.particleManager.entities, this.moonEntity, this.birdEntity];
            }
            
            this.renderSystem.render(drawObjects);
        }
       
        this.uiManager.render();
    };
}
