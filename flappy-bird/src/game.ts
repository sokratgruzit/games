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
    createExplosionEntity
} from "./ecs/entities";
import { 
    BirdComponent, 
    InputComponent, 
    PositionComponent, 
    SpriteComponent, 
    GameStateComponent
} from "./ecs/components";
import { Background } from "./objects/background";
import { GameEngine } from "./objects/engine";
import { ParticleManager } from "./managers/particle-manager";
import { ObstacleManager } from "./managers/obstacle-manager";
import { InputManager } from "./managers/input-manager";
import { SoundManager } from "./managers/sound-manager";
import { EventBus } from "./managers/event-bus";
import { UIManager } from "./managers/ui-manager";

import birdJson from "./objects/dragon.json";
import explosionJson from "./objects/explosion.json";
import { Entity } from "./ecs/entity";

export class GameController {
    private ctx: CanvasRenderingContext2D;
    private explosions: Entity[];
    private background: Background;
    private engine: GameEngine;
    private width: number;
    private height: number;
    private particleManager: ParticleManager;
    private obstacleManager: ObstacleManager;
    private inputManager: InputManager;
    private eventBus: EventBus;

    uiManager: UIManager;
    soundManager: SoundManager;
    gameSpeed: number;

    private entityIdCounter = 1;
    private physicsSystem: PhysicsSystem;
    private renderSystem: RenderSystem;
    private collisionSystem: CollisionSystem;
    private animationSystem: AnimationSystem;
    private inputSystem: InputSystem;
    private gameSystem: GameStateSystem;

    private birdEntity: Entity;
    private gameEntity: Entity;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.gameSpeed = 2;

        this.gameEntity = createGameEntity(this.entityIdCounter++);
        this.birdEntity = createBirdEntity(this.entityIdCounter++, width, height, birdJson, 0.1);
        
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

        this.background = new Background(width, height);
        this.soundManager = new SoundManager(this.eventBus);
        this.uiManager = new UIManager(this.ctx, this.width, this.height, this.gameEntity);
        this.explosions = [];

        this.eventBus.on("birdCollision", (x: number, y: number) => {
            const explosionEntity1 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 1);
            const explosionEntity2 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 1.5);
            const explosionEntity3 = createExplosionEntity(this.entityIdCounter++, x, y, explosionJson, 2);
            this.explosions.push(explosionEntity1);
            this.explosions.push(explosionEntity2);
            this.explosions.push(explosionEntity3);
       
            this.eventBus.emit("explosionPlay", { x, y, index: 0 });
        });

        this.eventBus.on("explosionFinished", () => {
            const game = this.gameEntity.getComponent<GameStateComponent>("game");
            
            console.log(game?.currentExplosionIndex)
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
        this.birdEntity = createBirdEntity(this.entityIdCounter++, this.width, this.height, birdJson, 0.1);
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
            this.physicsSystem.update([this.birdEntity, ...this.obstacleManager.entities, ...this.particleManager.entities, ...this.explosions], this.eventBus, _dt);
            this.collisionSystem.collisions(this.birdEntity, this.obstacleManager.entities);
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
            gameState?.frame || 0
        );

        this.background.update(this.gameSpeed);
    };

    private render = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.background.draw(this.ctx);

        const gameState = this.gameEntity.getComponent<GameStateComponent>("game");
        
        let drawObjects: Entity[] = [];

        if (!gameState?.gameOver) {
            drawObjects = [this.birdEntity, ...this.obstacleManager.entities, ...this.particleManager.entities];
        }
        
        this.renderSystem.render(drawObjects.concat(this.explosions));
        this.uiManager.render();
    };
}
