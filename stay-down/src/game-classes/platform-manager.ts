import { Platform } from "./platform"

export class PlatformManager {
    activePlatforms: Platform[];

    constructor(activePlatforms: Platform[]) {
        this.activePlatforms = activePlatforms;
    }

    createPlatform(x: number, y: number): void {
        this.activePlatforms.push(new Platform(x, y, 48, 4, "blue"));
    }
}