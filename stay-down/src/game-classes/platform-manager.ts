import { Platform } from "./platform";

export class PlatformManager {
    activePlatforms: Platform[];
    images: HTMLImageElement[];

    constructor(activePlatforms: Platform[], imagePaths: string[]) {
        this.activePlatforms = activePlatforms;

        // Загружаем картинки платформ
        this.images = imagePaths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    createPlatform(x: number, y: number): void {
        const randomIndex = Math.floor(Math.random() * this.images.length);
        const image = this.images[randomIndex];

        // Hitbox платформы оставляем тонким (например, 4px)
        const width = 80;
        const height = 4;

        this.activePlatforms.push(new Platform(x, y, width, height, "#000", image));
    }
}
