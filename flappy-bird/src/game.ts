import { Bird } from "./objects/bird";
import { Explosion } from "./objects/explosion";
import { Background } from "./objects/background";
import { GameEngine } from "./objects/engine";
import { ParticleManager } from "./managers/particle-manager";
import { ObstacleManager } from "./managers/obstacle-manager";
import { InputManager } from "./managers/input-manager";
import { CollisionManager } from "./managers/collision-manager";
import { SoundManager } from "./managers/sound-manager";
import { EventBus } from "./managers/event-bus";
import { UIManager } from "./managers/ui-manager";

import birdJson from "./objects/dragon.json";
import explosionJson from "./objects/explosion.json";

export class GameController {
    private ctx: CanvasRenderingContext2D;
    private bird: Bird;
    private explosions: Explosion[];
    private currentExplosionIndex: number;
    private background: Background;
    private gameOver: boolean;
    private paused: boolean;
    private engine: GameEngine;
    private width: number;
    private height: number;
    private hue: number;
    private frame: number;
    private score: number;
    private particleManager: ParticleManager;
    private obstacleManager: ObstacleManager;
    private inputManager: InputManager;
    private collisionManager: CollisionManager;
    private particlePlaying: boolean;
    private eventBus: EventBus;
    
    uiManager: UIManager;
    soundManager: SoundManager;
    gameSpeed: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.hue = 0;
        this.frame = 0;
        this.gameSpeed = 2;
        this.paused = false;
        this.score = 0;
        this.gameOver = false;
        this.currentExplosionIndex = 0;
        this.particlePlaying = false;

        // EventBus
        this.eventBus = new EventBus();

        // Объекты игры
        this.bird = new Bird(height, birdJson, 0.1, this.eventBus);
        this.particleManager = new ParticleManager();
        this.obstacleManager = new ObstacleManager(this.eventBus);
        this.background = new Background(width, height);
        this.inputManager = new InputManager();
        this.collisionManager = new CollisionManager();
        this.soundManager = new SoundManager(this.eventBus);
        this.uiManager = new UIManager(this.ctx, this.width, this.height, this.eventBus);

        this.explosions = [
            new Explosion(explosionJson, 1, this.eventBus),
            new Explosion(explosionJson, 1.5, this.eventBus),
            new Explosion(explosionJson, 2, this.eventBus)
        ];

        // Подписки
        this.eventBus.on("birdCollision", (x: number, y: number) => {
            this.gameOver = true;
            this.currentExplosionIndex = 0;
            this.eventBus.emit("explosionPlay", { x, y, index: 0 });
            this.stopParticleSound();
        });

        this.eventBus.on("explosionFinished", () => {
            this.currentExplosionIndex++;
            if (this.currentExplosionIndex < this.explosions.length) {
                this.eventBus.emit("explosionPlay", { x: this.bird.x, y: this.bird.y, index: this.currentExplosionIndex });
            }
        });

        this.eventBus.on("pauseToggled", () => {
            this.paused = !this.paused;
        });

        this.eventBus.on("restartGame", () => {
            this.restartGame();
        });

        this.eventBus.on("gameOver", () => {
            this.gameOver = true;
        });

        this.eventBus.on("scoreIncrease", () => {
            this.score++;
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

        this.bird = new Bird(this.height, birdJson, 0.1, this.eventBus);
        this.particleManager.clear();
        this.obstacleManager.clear();
        this.hue = 0;
        this.frame = 0;
        this.gameOver = false;
        this.paused = false;
        this.currentExplosionIndex = 0;
        this.explosions.forEach(e => e.update());
        this.score = 0;
        this.particlePlaying = true;
    }

    private update = (_dt: number) => {
        if (this.inputManager.wasJustPressed("KeyP")) {
            this.eventBus.emit("pauseToggled");
        }

        if (this.inputManager.wasJustPressed("KeyR")) {
            this.eventBus.emit("restartGame");
        }

        if (this.paused) return;
        if (this.gameOver && this.currentExplosionIndex >= this.explosions.length) {
            this.eventBus.emit("gameOver");
            return;
        }

        if (!this.gameOver) {
            this.bird.update(this.inputManager.isPressed("Space"));

            if (this.inputManager.isPressed("Space")) {
                this.eventBus.emit("birdFlap");
            }
        }

        this.particleManager.setGameSpeed(this.gameSpeed);
        this.particleManager.update(this.bird, `hsla(${this.hue}, 100%, 50%, 0.8)`);

        this.obstacleManager.setGameSpeed(this.gameSpeed);
        this.obstacleManager.updateAndGenerate(
            this.width,
            this.height,
            `hsla(${this.hue}, 100%, 50%, 0.8)`,
            this.frame
        );

        this.background.update(this.gameSpeed);

        // Коллизия
        if (!this.gameOver && this.collisionManager.checkCollision(this.bird, this.obstacleManager.obstacles)) {
            this.eventBus.emit("birdCollision", this.bird.x, this.bird.y);
        }

        // обновляем все взрывы
        this.explosions.forEach(e => e.update());

        this.hue++;
        this.frame++;
    };

    private render = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.background.draw(this.ctx);
        this.obstacleManager.draw(this.ctx);

        if (!this.gameOver) this.particleManager.draw(this.ctx);
        if (!this.gameOver) this.bird.draw(this.ctx);

        this.explosions.forEach(e => e.draw(this.ctx));

        this.uiManager.render();
    };

    private stopParticleSound() {
        if (this.particlePlaying) {
            this.particlePlaying = false;
        }
    }
}
