import Phaser from "phaser";
import { BLOCK_WIDTH, BLOCK_HEIGHT } from "../constants";
import type { BlockType } from "../types";

export class Block extends Phaser.Physics.Arcade.Sprite {
    maxHits: number;
    currentHits: number;

    constructor(scene: Phaser.Scene, x: number, y: number, type: BlockType, hits: number) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.setDisplaySize(BLOCK_WIDTH, BLOCK_HEIGHT);
        this.body!.setSize(this.width, this.height, true);
        this.maxHits = hits;
        this.currentHits = hits;
        this.setAlpha(1);
    }

    hit() {
        this.currentHits--;
        this.setAlpha(0.25 + (this.currentHits / this.maxHits) * 0.75);

        this.scene.tweens.add({
            targets: this,
            y: this.y - 5,
            duration: 50,
            yoyo: true,
            ease: 'Power1'
        });
        
        if (this.currentHits <= 0) this.disableBody(true, true);
    }
}
