import { Entity } from "../entity";
import { PositionComponent, SizeComponent, ObstacleComponent } from "../components";
import { EventBus } from "../../managers/event-bus";

export class CollisionSystem {
    private eventBus: EventBus;
    private canvasHeight: number;

    constructor(eventBus: EventBus, canvasHeight: number) {
        this.eventBus = eventBus;
        this.canvasHeight = canvasHeight;
    }

    collisions(bird: Entity, obstacles: Entity[]) {
        const pos = bird.getComponent<PositionComponent>("position");
        const size = bird.getComponent<SizeComponent>("size");

        if (!pos || !size) return;

        // === столкновения с препятствиями ===
        for (const obs of obstacles) {
            const oPos = obs.getComponent<PositionComponent>("position");
            const oSize = obs.getComponent<SizeComponent>("size");
            const obstacle = obs.getComponent<ObstacleComponent>("obstacle");

            if (!oPos || !oSize || !obstacle) continue;

            const birdLeft = pos.x;
            const birdRight = pos.x + size.width;
            const birdTop = pos.y;
            const birdBottom = pos.y + size.height;

            const obsLeft = oPos.x;
            const obsRight = oPos.x + oSize.width;

            const topRectBottom = obstacle.top; // низ верхнего прямоугольника
            const bottomRectTop = this.canvasHeight - obstacle.bottom; // верх нижнего прямоугольника

            // верхнее препятствие
            if (birdRight > obsLeft && birdLeft < obsRight && birdTop < topRectBottom) {
                this.eventBus.emit("birdCollision", pos.x, pos.y);
                return;
            }

            // нижнее препятствие
            if (birdRight > obsLeft && birdLeft < obsRight && birdBottom > bottomRectTop) {
                this.eventBus.emit("birdCollision", pos.x, pos.y);
                return;
            }
        }
    }
}
