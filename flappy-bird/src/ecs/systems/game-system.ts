import { Entity } from "../entity";
import { EventBus } from "../../managers/event-bus";
import { GameStateComponent, InputComponent, PositionComponent, SpriteComponent, ExplosionComponent } from "../components";

export class GameStateSystem {
    private game: GameStateComponent;
    private input: InputComponent;
    private eventBus: EventBus;

    constructor(entity: Entity, eventBus: EventBus) {
        this.game = entity.getComponent<GameStateComponent>("game")!;
        this.input = entity.getComponent<InputComponent>("input")!;
        this.eventBus = eventBus;

        this.registerEventListeners();
    }

    private registerEventListeners() {
        this.eventBus.on("birdCollision", () => {
            this.game.gameOver = true;
            this.game.currentExplosionIndex = 0;
            this.game.particlePlaying = false;
        });

        this.eventBus.on("explosionFinished", () => {
            this.game.currentExplosionIndex++;
        });

        this.eventBus.on("restartGame", () => {
            this.resetGame();
        });

        this.eventBus.on("gameOver", () => {
            this.game.gameOver = true;
        });

        this.eventBus.on("scoreIncrease", () => {
            this.game.score++;
        });
    }

    private resetGame() {
        this.game.score = 0;
        this.game.gameOver = false;
        this.game.paused = false;
        this.game.hue = 0;
        this.game.frame = 0;
        this.game.currentExplosionIndex = 0;
        this.game.particlePlaying = true;
    }

    update() {
        if (this.input.keys["KeyP"]) {
            this.eventBus.emit("pauseToggled");
            this.game.paused = !this.game.paused;
        } 

        if (this.input.keys["KeyR"]) {
            this.eventBus.emit("restartGame");
        }

        this.game.hue++;
        this.game.frame++;
    }

    explode(explosion: Entity, x: number, y: number) {
        const pos = explosion.getComponent<PositionComponent>("position");
        const sprite = explosion.getComponent<SpriteComponent>("sprite");
        const exp = explosion.getComponent<ExplosionComponent>("explosion");

        if (pos && sprite && exp) {
            pos.x = x;
            pos.y = y;
            exp.active = true;
            exp.frameTimer = 0;
            sprite.currentFrame = 0;
        }
    }
}
