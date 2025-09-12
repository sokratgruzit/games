import {
    GRAVITY,
    FRICTION,
    WORLD_HEIGHT,
    WORLD_WIDTH,
    GROUND
} from "../constants";

import { Player } from "./player";
import { Controller } from "./controller";
import { PlatformManager } from "./platform-manager";
import { DetectCollisions } from "./collisions";
import { ItemManager } from "./item-manager";
import { Score } from "./score";
import { Ground } from "./ground";
import { BladesManager } from "./blade-manager";
import { Background } from "./background";
import { SoundManager } from "./sound-manager";

type LetterAnim = {
    char: string;
    targetX: number;
    targetY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    arrived: boolean;
    exit: boolean;
};

export class GameState {
    player: Player;
    controller: Controller;
    ctx: CanvasRenderingContext2D;
    platformManager: PlatformManager;
    bladesManager: BladesManager;
    collisions: DetectCollisions;
    itemManager: ItemManager;
    score: Score;
    ground: Ground;
    background: Background;
    soundManager: SoundManager;

    private letters: LetterAnim[] = [];
    private lettersInitialized = false;
    private isGameOver = false;

    constructor(
        controller: Controller,
        player: Player,
        ctx: CanvasRenderingContext2D,
        platformManager: PlatformManager,
        collisions: DetectCollisions,
        itemManager: ItemManager,
        score: Score,
        bladesManager: BladesManager,
        background: Background,
        soundManager: SoundManager
    ) {
        this.player = player;
        this.controller = controller;
        this.ctx = ctx;
        this.platformManager = platformManager;
        this.collisions = collisions;
        this.itemManager = itemManager;
        this.score = score;
        this.bladesManager = bladesManager;
        this.ground = new Ground(0, GROUND.top, WORLD_WIDTH, 50, "#000");
        this.background = background;
        this.soundManager = soundManager;
    }

    update() {
        this.background.update(this.player.y);

        // --- обработка Game Over и Pause ---
        if (this.isGameOver) {
            // Enter → разлёт букв
            if (this.controller.start && this.lettersInitialized) {
                for (let letter of this.letters) {
                    letter.exit = true;
                    letter.vx = (Math.random() - 0.5) * 15;
                    letter.vy = (Math.random() - 0.5) * 15;
                }
                this.lettersInitialized = false;
            }

            if (
                this.letters.length > 0 &&
                this.letters.every(
                    l =>
                        l.exit &&
                        (l.x < -100 ||
                            l.x > WORLD_WIDTH + 100 ||
                            l.y < -100 ||
                            l.y > WORLD_HEIGHT + 100)
                )
            ) {
                this.restart();
            }

            return; // при Game Over не апдейтим игрока/мир
        }

        // --- обычный апдейт игры ---
        this.checkGameEnd(this.player);

        if (this.controller.left) this.player.moveLeft();
        if (this.controller.right) this.player.moveRight();
        if (this.controller.up) {
            this.player.jump();
            this.soundManager.play("jump");
        }
        if (this.controller.down) {
            const direction = this.player.velocity_x >= 0 ? 1 : -1;
            this.player.slide(direction);
            this.soundManager.play("slide");
        }

        this.player.updatePosition(GRAVITY, FRICTION);
        this.score.update();

        if (this.collisions.groundCollision(this.player, GROUND.top)) {
            this.player.setBottom(GROUND.top);
            this.player.ground();
        }

        this.updatePlatforms();
        this.updateItems();
        this.updateBlades();
    }

    render() {
        // фон
        this.background.render();

        // платформы
        const platforms = this.platformManager.activePlatforms;
        for (let i = platforms.length - 1; i >= 0; --i) {
            platforms[i].render(this.ctx);
        }

        // предметы
        const items = this.itemManager.activeItems;
        for (let i = items.length - 1; i >= 0; --i) {
            items[i].render(this.ctx);
        }

        const blades = this.bladesManager.activeBlades;
        for (let i = blades.length - 1; i >= 0; --i) {
            blades[i].render(this.ctx);
        }

        // земля
        this.ground.render(this.ctx);

        // игрок
        if (!this.isGameOver && !this.controller.pause) {
            this.player.render(this.ctx);
        }

        // очки
        this.score.render(this.ctx);

        // затемнение и буквы при Game Over
        if (this.isGameOver) {
            this.ctx.fillStyle = "rgba(0,0,0,0.6)";
            this.ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            this.renderLetters();
        }
    }

    private checkGameEnd(player: Player) {
        if (player.getTop() < 24) {
            player.y = player.old_y = GROUND.top - player.height;
            player.x = 0;
            this.score.value = 0;
            this.isGameOver = true;
            this.controller.getGameOver(true);
            if (!this.lettersInitialized) {
                this.initLettersAnim("GAME OVER");
                this.soundManager.pauseBg();
                this.soundManager.play("gameover");
            }
        }
    }

    private initLettersAnim(text: string) {
        this.letters = [];
        const fontSize = 32;
        this.ctx.font = `${fontSize}px Arial`;
        const textWidth = this.ctx.measureText(text).width;
        const startX = (WORLD_WIDTH - textWidth) / 2;
        const startY = WORLD_HEIGHT / 2;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const targetX = startX + this.ctx.measureText(text.substring(0, i)).width;
            const targetY = startY;

            let x: number, y: number;
            const side = Math.floor(Math.random() * 4);
            if (side === 0) { x = -100; y = Math.random() * WORLD_HEIGHT; }
            else if (side === 1) { x = WORLD_WIDTH + 100; y = Math.random() * WORLD_HEIGHT; }
            else if (side === 2) { x = Math.random() * WORLD_WIDTH; y = -100; }
            else { x = Math.random() * WORLD_WIDTH; y = WORLD_HEIGHT + 100; }

            const dx = targetX - x;
            const dy = targetY - y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const vx = (dx / len) * 12;
            const vy = (dy / len) * 12;

            this.letters.push({ char, targetX, targetY, x, y, vx, vy, arrived: false, exit: false });
        }
        this.lettersInitialized = true;
    }

    private renderLetters() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.textBaseline = "top";

        for (let letter of this.letters) {
            if (!letter.arrived && !letter.exit) {
                const dx = letter.targetX - letter.x;
                const dy = letter.targetY - letter.y;
                if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
                    letter.arrived = true;
                    letter.x = letter.targetX;
                    letter.y = letter.targetY;
                } else {
                    letter.x += letter.vx;
                    letter.y += letter.vy;
                }
            } else if (letter.exit) {
                letter.x += letter.vx * 2;
                letter.y += letter.vy * 2;
            }
            this.ctx.fillText(letter.char, letter.x, letter.y);
        }
    }

    private restart() {
        this.soundManager.resumeBg();
        this.isGameOver = false;
        this.letters = [];
        this.lettersInitialized = false;

        this.player.y = GROUND.top - this.player.height;
        this.player.x = 0;
        this.player.velocity_x = 0;
        this.player.velocity_y = 0;

        this.controller.start = false;
        this.controller.getGameOver(false);
        this.score.reset();
        this.createPlatforms();
        this.createItems();
        this.createBlades();
    }

    private updatePlatforms() {
        const platforms = this.platformManager.activePlatforms;
        for (let index = platforms.length - 1; index >= 0; --index) {
            const platform = platforms[index];
            if (this.collisions.platformCollision(this.player, platform)) {
                this.player.setBottom(platform.getTop());
                this.player.ground();
            }
            platform.moveUp();
            if (platform.y < 32) {
                platform.y = WORLD_HEIGHT;
                platform.move_force = Math.random() * 1 + 1;
            }
        }
    }

    private updateItems() {
        const items = this.itemManager.activeItems;
        for (let index = items.length - 1; index >= 0; --index) {
            const item = items[index];
            if (this.collisions.itemCollision(this.player, item)) {
                this.soundManager.play("coin");
                this.score.add(1, item.x, item.y);
                item.setLeft(Math.random() * (WORLD_WIDTH - item.width));
                item.setTop(Math.random() * (WORLD_HEIGHT - item.height - (WORLD_HEIGHT - GROUND.top)));
            } else {
                item.update();
            }
        }
    }

    private updateBlades() {
        const blades = this.bladesManager.activeBlades;
        for (let index = blades.length - 1; index >= 0; --index) {
            const blade = blades[index];
            blade.update();
        }
    }

    createItems() {
        this.itemManager.activeItems = [];
        for (let i = 0; i < 4; i++) {
            this.itemManager.createItem(
                100,
                Math.random() * (WORLD_HEIGHT - 16 - (WORLD_HEIGHT - GROUND.top)),
                "green",
                i
            );
        }
    }

    createBlades() {
        this.bladesManager.activeBlades = [];
        for (let i = 0; i < 10; i++) {
            this.bladesManager.createBlade(
                i * 48,
                -12,
                "green"
            );
        }
    }

    createPlatforms() {
        this.platformManager.activePlatforms = [];
        for (let x = WORLD_WIDTH; x > 0; x -= 24) {
            this.platformManager.createPlatform(x + 8, GROUND.top);
        }
    }
}
