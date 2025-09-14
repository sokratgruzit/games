import type { FrameData, SpriteJSON } from "../types";
import { EventBus } from "../managers/event-bus";

export class Bird {
    x: number;
    y: number;
    vy: number;
    weight: number;
    angle: number;
    width: number;
    height: number;
    canvasHeight: number;

    sprite: HTMLImageElement;
    frames: FrameData[];
    currentFrame: number;
    scale: number;

    private flapTimer: number = 0;
    private defaultFlyTimer: number = 0;
    private eventBus: EventBus;

    constructor(canvasHeight: number, json: SpriteJSON, scale: number, eventBus: EventBus) {
        this.x = 150;
        this.canvasHeight = canvasHeight;
        this.y = canvasHeight / 2;
        this.vy = 0;
        this.angle = 0;
        this.currentFrame = 0;
        this.scale = scale;
        this.weight = 1;

        this.sprite = new Image();
        this.sprite.src = `assets/sprites/${json.meta.image}`;

        this.frames = Object.values(json.frames);
        const frame = this.frames[0].frame;
        this.width = frame.w * this.scale;
        this.height = frame.h * this.scale;

        this.eventBus = eventBus; // сохраняем EventBus
    }

    update(spacePressed: boolean) {
        const frame = this.frames[this.currentFrame].frame;
        this.width = frame.w * this.scale;
        this.height = frame.h * this.scale;

        const amplitude = 15;
        const lowerBound = this.canvasHeight - this.height - amplitude * 2;
        const upperBound = this.canvasHeight - this.height;

        if (spacePressed) {
            this.vy -= 2;
            this.y += this.vy;
            this.vy *= 0.9;
            this.flap();
        } else if (this.y >= lowerBound && this.y <= upperBound) {
            this.defaultFlyTimer++;
            const baseY = lowerBound + amplitude;
            this.y = baseY + Math.sin(this.defaultFlyTimer * 0.05) * amplitude;

            if (this.defaultFlyTimer % 15 === 0) {
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            }
        } else {
            this.vy += this.weight;
            this.y += this.vy;
            this.vy *= 0.9;
            this.currentFrame = 0;
            this.flapTimer = 0;

            // Если птица упала ниже канвы — эмитим событие
            if (this.y + this.height >= this.canvasHeight) {
                this.eventBus.emit("birdCollision", this.x, this.y);
            }
        }

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.canvasHeight) this.y = this.canvasHeight - this.height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const frame = this.frames[this.currentFrame].frame;
        ctx.drawImage(
            this.sprite,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            this.x,
            this.y,
            frame.w * this.scale,
            frame.h * this.scale
        );
    }

    flap() {
        this.flapTimer++;
        if (this.flapTimer % 3 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    }
}
