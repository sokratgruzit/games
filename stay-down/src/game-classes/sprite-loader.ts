import type { Frame } from "../types";

export class SpriteLoader {
    static loadSpriteFrames(
        src: string,
        frameWidth: number,
        frameHeight: number,
        frameCount: number
    ): Promise<Frame[]> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;

            image.onload = () => {
                const frames: Frame[] = [];

                for (let i = 0; i < frameCount; i++) {
                    const canvas = document.createElement("canvas");
                    canvas.width = frameWidth;
                    canvas.height = frameHeight;
                    const ctx = canvas.getContext("2d")!;

                    ctx.drawImage(
                        image,
                        i * frameWidth, 0, frameWidth, frameHeight,
                        0, 0, frameWidth, frameHeight
                    );

                    // Используем canvas напрямую
                    frames.push({
                        image: canvas,
                        width: frameWidth,
                        height: frameHeight
                    });
                }

                resolve(frames);
            };

            image.onerror = () => reject(`Failed to load image: ${src}`);
        });
    }
}
