import Phaser from "phaser";
import { Paddle } from "../objects/paddle";
import { Ball } from "../objects/ball";
import { Block } from "../objects/block";
import { HUD } from "../ui/hud";
import { LEVELS } from "../managers/level-manager";
import { BLOCK_COLORS } from "../constants";
import { Starfield } from "./starfield";
import { SoundManager } from "../managers/sound-manager";

export class GameScene extends Phaser.Scene {
    paddle!: Paddle;
    ball!: Ball;
    blocks!: Phaser.Physics.Arcade.StaticGroup;
    hud!: HUD;
    starfield!: Starfield;
    soundManager!: SoundManager;

    score = 0;
    lives = 3;
    level = 1;

    restartBtn!: Phaser.GameObjects.Image;
    restartText!: Phaser.GameObjects.Text;

    ballOnPaddle = true;

    constructor() { super({ key: "GameScene" }); }

    preload() {
        this.load.image("paddle", "assets/paddle.png");
        this.load.image("ball", "assets/ball.png");
        BLOCK_COLORS.forEach(c => this.load.image(c, `assets/${c}-block.png`));
        this.load.image("red", "assets/red-block.png");

        this.soundManager = new SoundManager(this);
        this.soundManager.preload();
    }

    create() {
        this.physics.world.checkCollision.down = false;

        this.starfield = new Starfield(this, 2000);

        this.hud = new HUD(this, this.score, this.lives, this.level);

        this.paddle = new Paddle(this, 400, 585);
        this.ball = new Ball(this, 400, 500);
        this.blocks = this.physics.add.staticGroup();

        this.physics.add.collider(this.ball, this.paddle, () => {
            this.hitPaddle();
            this.soundManager.playSound("hitPaddle");
        }, undefined, this);
        this.physics.add.collider(this.ball, this.blocks, (_, b) => {
            this.hitBlock(b as Phaser.Physics.Arcade.Sprite);
            this.soundManager.playSound("hitBlock");
        }, undefined, this);

        this.restartBtn = this.add.image(400, 300, "red").setDisplaySize(200, 60).setInteractive()
            .on("pointerdown", () => {
                this.soundManager.playSound("restartBtn");
                this.restartGame();
            });
        this.restartText = this.add.text(400, 300, "RESTART", { fontSize: "28px", color: "#fff" }).setOrigin(0.5);
        this.restartBtn.setVisible(false).setDepth(5000);
        this.restartText.setVisible(false).setDepth(5000);

        const keyboard = this.input.keyboard;
        if (keyboard) {
            keyboard.on('keydown-SPACE', () => {
                if (this.ballOnPaddle && this.lives > 0) this.launchBall();
            });
        }

        this.soundManager.create();
        this.soundManager.playBG();

        this.startLevel(this.level);
    }

    update() {
        const keyboard = this.input.keyboard;
        if (!keyboard) return;

        const cursors = keyboard.createCursorKeys();
        this.paddle.move(cursors);

        if (this.ballOnPaddle) {
            this.ball.setX(this.paddle.x);
            this.ball.setY(this.paddle.y - 28);
        } else {
            this.ball.updateRotation();
            if (this.ball.y > 600) this.loseLife();
        }

        this.starfield.update();
    }

    hitPaddle() {
        if (!this.ball.body) return;
        const diff = this.ball.x - this.paddle.x;
        const paddleVelocity = this.paddle.body?.velocity.x || 0;
        if (diff !== 0) this.ball.setVelocityX(10 * diff + paddleVelocity * 0.3);
    }

    loseLife() {
        if (this.lives > 0) this.lives--;
        this.hud.updateLives(this.lives);

        if (this.lives === 0) {
            this.soundManager.playSound("gameOver");
            this.ball.disableBody(true, true);
            this.restartBtn.setVisible(true);
            this.restartText.setVisible(true);
        } else {
            this.ball.setVelocity(0, 0);
            this.ball.setPosition(this.paddle.x, this.paddle.y - 20);
            this.ballOnPaddle = true;
        }
    }

    launchBall() {
        const baseSpeed = 200 + 50 * (this.level - 1);
        const angle = Phaser.Math.Between(-75, -45);
        const rad = Phaser.Math.DegToRad(angle);
        this.ball.setVelocity(baseSpeed * Math.cos(rad), baseSpeed * Math.sin(rad));
        this.ballOnPaddle = false;
    }

    hitBlock(block: Phaser.Physics.Arcade.Sprite) {
        (block as Block).hit();
        if (!(block as Block).active) {
            this.score += 10;
            this.hud.updateScore(this.score);
        }
        if (this.blocks.countActive() === 0) this.nextLevel();
    }

    startLevel(level: number) {
        this.blocks.clear(true, true);
        const config = LEVELS[level];

        for (let r = 0; r < config.rows; r++) {
            for (let c = 0; c < config.columns; c++) {
                const type = config.pattern(r, c);
                const block = new Block(this, 85 + c * 90, 70 + r * 60, type, { green: 1, yellow: 2, pink: 3, purple: 4, red: 5 }[type]);
                this.blocks.add(block);
            }
        }

        this.hud.updateLevel(level);

        this.ball.setVelocity(0, 0);
        this.ball.setPosition(this.paddle.x, this.paddle.y - 20);
        this.ballOnPaddle = true;
    }

    nextLevel() {
        this.level++;
        if (this.level > 4) this.level = 1;
        this.startLevel(this.level);
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;

        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);
        this.hud.updateLevel(this.level);

        this.restartBtn.setVisible(false);
        this.restartText.setVisible(false);

        // Включаем мяч
        this.ball.enableBody(true, this.paddle.x, this.paddle.y - 20, true, true);
        this.ball.setVelocity(0, 0);
        this.ballOnPaddle = true;

        this.startLevel(this.level);
    }
}
