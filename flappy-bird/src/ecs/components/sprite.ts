import type { FrameData } from "../../types";

export class SpriteComponent {
    sprite: HTMLImageElement;
    frames: FrameData[];
    currentFrame: number;
    scale: number;
    width: number;
    height: number;

    constructor(imageSrc: string, frames: FrameData[], scale: number) {
        this.sprite = new Image();
        this.sprite.src = imageSrc;
        this.frames = frames;
        this.currentFrame = 0;
        this.scale = scale;

        const frame = frames[0].frame;
        this.width = frame.w * scale;
        this.height = frame.h * scale;
    }
}