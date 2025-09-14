import { Bird } from "../objects/bird";
import { Obstacle } from "../objects/obstacle";

export class CollisionManager {
    checkCollision(bird: Bird, obstacles: Obstacle[]): boolean {
        for (const obs of obstacles) {
            // Верхняя труба
            const hitTop = 
                bird.x < obs.x + obs.width &&
                bird.x + bird.width > obs.x &&
                bird.y < obs.top;

            // Нижняя труба
            const hitBottom =
                bird.x < obs.x + obs.width &&
                bird.x + bird.width > obs.x &&
                bird.y + bird.height > obs.canvasHeight - obs.bottom;

            if (hitTop || hitBottom) {
                return true;
            }
        }
        return false;
    }
}
