// animated-sprite.ts
import type { Frame } from "../types";

export class AnimatedSprite {
    frames: Frame[];
    currentFrame: number;
    frameDuration: number; // сколько мс держать один кадр
    lastUpdate: number; // timestamp последнего обновления кадра

    constructor(frames: Frame[], framesPerSecond: number) {
        this.frames = frames;
        this.currentFrame = 0;
        this.frameDuration = 1000 / framesPerSecond;
        this.lastUpdate = performance.now();
    }

    update() {
        const now = performance.now();
        if (now - this.lastUpdate >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.lastUpdate = now;
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width?: number, height?: number) {
        const frame = this.frames[this.currentFrame];
        const drawWidth = width ?? frame.width;
        const drawHeight = height ?? frame.height;
        ctx.drawImage(frame.image, x, y, drawWidth, drawHeight);
    }
}
