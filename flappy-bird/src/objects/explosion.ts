import type { FrameData, SpriteJSON } from "../types";
import { EventBus } from "../managers/event-bus";

export class Explosion {
    private sprite: HTMLImageElement;
    private frames: FrameData[];
    private currentFrame: number;
    private x: number;
    private y: number;
    private scale: number;
    private active: boolean;
    private frameTimer: number;
    private frameDelay: number;
    private eventBus: EventBus;

    constructor(json: SpriteJSON, scale: number, eventBus: EventBus, frameDelay: number = 0) {
        this.sprite = new Image();
        this.sprite.src = `assets/sprites/${json.meta.image}`;
        this.frames = Object.values(json.frames);
        this.currentFrame = 0;
        this.scale = scale;
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.frameTimer = 0;
        this.frameDelay = frameDelay;
        this.eventBus = eventBus;

        this.eventBus.on("explosionPlay", ({ x, y, index }: { x: number; y: number; index: number }) => {
            if (index === undefined) return;
            this.play(x, y);
        });
    }

    private play(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.active = true;
    }

    update() {
        if (!this.active) return;

        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.frames.length) {
                this.active = false;
                this.eventBus.emit("explosionFinished");
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;
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

    isActive() {
        return this.active;
    }
}
