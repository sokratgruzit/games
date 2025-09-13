import type { Star } from "../types";

export class Starfield {
    scene: Phaser.Scene;
    stars: Star[] = [];
    width: number;
    height: number;

    constructor(scene: Phaser.Scene, count: number) {
        this.scene = scene;
        this.width = Number(scene.sys.game.config.width);
        this.height = Number(scene.sys.game.config.height);

        for (let i = 0; i < count; i++) {
            const star: Star = scene.add.graphics() as Star;
            star.xPos = Math.random() * this.width;
            star.yPos = Math.random() * this.height;
            star.size = Math.random() * 1 + 0.1;
            star.baseAlpha = 0.6 + Math.random() * 0.4;
            star.speed = 0.1 + Math.random() * 0.3;
            this.stars.push(star);
        }
    }

    update() {
        for (let s of this.stars) {
            s.clear();
            const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(Date.now() / 200 + s.xPos));
            s.fillStyle(0xffffff, alpha);
            s.fillCircle(s.xPos, s.yPos, s.size);

            s.yPos -= s.speed;
            if (s.yPos < 0) s.yPos = this.height;
        }
    }
}