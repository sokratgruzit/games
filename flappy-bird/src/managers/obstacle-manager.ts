import { createObstacleEntity } from "../ecs/entities";
import type { Entity } from "../ecs/entity";

export class ObstacleManager {
    entities: Entity[] = [];
    private idCounter = 1;

    generate(canvasWidth: number, canvasHeight: number, color: string, frame: number) {
        if (frame % 300 === 0) {
            const entity = createObstacleEntity(this.idCounter++, canvasWidth, canvasHeight, color);
            this.entities.push(entity);
        }

        if (this.entities.length > 20) {
            this.entities.length = 20;
        }
    }

    clear() {
        this.entities.length = 0;
    }
}
