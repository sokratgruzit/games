import Phaser from "phaser";

export class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "paddle");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Гарантируем, что тело динамическое
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setImmovable(true);
            this.body.setCollideWorldBounds(true);
        }
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) return;

        if (cursors.left?.isDown) this.body.setVelocityX(-300);
        else if (cursors.right?.isDown) this.body.setVelocityX(300);
        else this.body.setVelocityX(0);
    }
}
