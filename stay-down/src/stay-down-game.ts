import { 
    WORLD_HEIGHT, 
    WORLD_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y
} from "./constants";

import { Player } from "./game-classes/player";
import { Controller } from "./game-classes/controller";
import { GameEngine } from "./game-classes/engine";
import { GameState } from "./game-classes/game-state";
import { PlatformManager } from "./game-classes/platform-manager";
import { ItemManager } from "./game-classes/item-manager";
import { DetectCollisions } from "./game-classes/collisions";
import { Score } from "./game-classes/score";
import { SpriteLoader } from "./game-classes/sprite-loader";
import { AnimatedSprite } from "./game-classes/animated-sprite";
import { BladesManager } from "./game-classes/blade-manager";
import { Background } from "./game-classes/background";

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player!: Player;
    controller: Controller;
    engine: GameEngine;
    state!: GameState;
    platformManager: PlatformManager;
    collisions: DetectCollisions;
    itemManager: ItemManager | null;
    bladesManager: BladesManager;
    score: Score;
    background: Background;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: true })!;

        this.itemManager = null;
        this.background = new Background(this.ctx, WORLD_WIDTH, WORLD_HEIGHT);
        this.bladesManager = new BladesManager([]);
        this.controller = new Controller(false, false, false, false, false, false);
        this.engine = new GameEngine(() => this.update(), () => this.render());
        this.platformManager = new PlatformManager([], [
            "assets/lake-land-stay-down.png",
            "assets/wood-land-stay-down.png",
            "assets/palm-land-stay-down.png"
        ]);
        this.collisions = new DetectCollisions();
        this.score = new Score();

        this.controller.activate();
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        const scaleX = window.innerWidth / WORLD_WIDTH;
        const scaleY = window.innerHeight / WORLD_HEIGHT;

        let scale = Math.min(scaleX, scaleY);
        scale = Math.min(scale, 1);

        this.canvas.width = WORLD_WIDTH;
        this.canvas.height = WORLD_HEIGHT;

        this.canvas.style.width = `${WORLD_WIDTH * scale}px`;
        this.canvas.style.height = `${WORLD_HEIGHT * scale}px`;
    }

    update() {
        if (this.controller.pause || !this.state) return;
        this.state.update();
    }

    render() {
        if (!this.state) return;
        this.state.render();
    }

    async start() {
        try {
            // Ждём загрузку кадров спрайта
            const idleFrames = await SpriteLoader.loadSpriteFrames(
                "assets/idle-stay-down.png",
                32, 32, 3
            );

            const runFrames = await SpriteLoader.loadSpriteFrames(
                "assets/run-stay-down.png",
                32, 32, 3
            );

            const jumpFrames = await SpriteLoader.loadSpriteFrames(
                "assets/jump-stay-down.png",
                32, 32, 3
            );

            const slideFrames = await SpriteLoader.loadSpriteFrames(
                "assets/slide-stay-down.png",
                32, 32, 3
            );

            const itemFrames = await SpriteLoader.loadSpriteFrames(
                "assets/stars-stay-down.png",
                32, 32, 3
            );

            const itemSprites = [
                new AnimatedSprite(itemFrames, 6),
                new AnimatedSprite(itemFrames, 6),
                new AnimatedSprite(itemFrames, 6),
                new AnimatedSprite(itemFrames, 6)
            ];

            this.itemManager = new ItemManager([], itemSprites);

            // Создаём игрока
            this.player = new Player(
                PLAYER_START_X,
                PLAYER_START_Y,
                PLAYER_WIDTH,
                PLAYER_HEIGHT,
                "red",
                new AnimatedSprite(idleFrames, 5),
                new AnimatedSprite(runFrames, 5),
                new AnimatedSprite(jumpFrames, 5),
                new AnimatedSprite(slideFrames, 5)
            );

            // Создаём состояние игры
            this.state = new GameState(
                this.controller,
                this.player,
                this.ctx,
                this.platformManager,
                this.collisions,
                this.itemManager,
                this.score,
                this.bladesManager,
                this.background
            );

            // Генерация платформ и предметов
            this.state.createPlatforms();
            this.state.createItems();
            this.state.createBlades();

            // Запуск движка только после инициализации
            this.engine.start();
        } catch (err) {
            console.error(err);
        }
    }

    stop() {
        this.engine.stop();
        this.controller.deactivate();
    }
}
