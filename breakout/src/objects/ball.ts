import Phaser from "phaser";
import { BALL_SIZE } from "../constants";

export class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "ball");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDisplaySize(BALL_SIZE, BALL_SIZE);
        this.setCollideWorldBounds(true, 1, 1);
        this.setBounce(1);
    }

    launch(level: number) {
        const baseSpeed = 150 + 50 * (level - 1);
        const angle = Phaser.Math.Between(-75, -45);
        const rad = Phaser.Math.DegToRad(angle);
        this.setVelocity(baseSpeed * Math.cos(rad), baseSpeed * Math.sin(rad));
        this.setPosition(400, 500);
    }

    updateRotation() {
        if (!this.body) return;
        const speed = Math.sqrt(this.body.velocity.x ** 2 + this.body.velocity.y ** 2);
        this.rotation += 0.002 * speed * Math.sign(this.body.velocity.x);
    }
}
