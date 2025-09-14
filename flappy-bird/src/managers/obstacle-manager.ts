import { Obstacle } from "../objects/obstacle";
import { EventBus } from "../managers/event-bus";

export class ObstacleManager {
    obstacles: Obstacle[] = [];
    gameSpeed: number = 2;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    updateAndGenerate(width: number, height: number, color: string, frame: number) {
        // Создаем новое препятствие
        if (frame % 300 === 0) {
            const obs = new Obstacle(width, height, color, this.eventBus);
            obs.setGameSpeed(this.gameSpeed);
            this.obstacles.unshift(obs);
        }

        // Обновляем все препятствия
        for (const obs of this.obstacles) {
            obs.update();
        }

        // Ограничиваем количество
        if (this.obstacles.length > 20) {
            this.obstacles.length = 20;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const obs of this.obstacles) {
            obs.draw(ctx);
        }
    }

    setGameSpeed(speed: number) {
        this.gameSpeed = speed;
        for (const obs of this.obstacles) {
            obs.setGameSpeed(speed);
        }
    }

    clear() {
        this.obstacles.length = 0;
    }
}
