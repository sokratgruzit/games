import type { Comet } from "../entities/Comet";
import type { CometTail } from "../entities/CometTail";
import type { EventBus } from "./EventBus";
import type { Collided } from "../types/types";



export class CollisionsManager {
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    checkCollisions(objects: Comet[] | CometTail[]): Collided {
        let collided: Collided = {
            obj1: null,
            obj2: null,
            collided: false
        };

        for (let i = 0; i < objects.length; i++) {
            const aParts = this.getCollisionParts(objects[i]);

            for (let j = i + 1; j < objects.length; j++) {
                const bParts = this.getCollisionParts(objects[j]);

                // сравниваем каждую сферу A с каждой сферой B
                for (const a of aParts) {
                    for (const b of bParts) {
                        const dist = a.position.distanceTo(b.position);
                        const sumR = a.radius + b.radius;

                        if (dist <= sumR) {
                            collided = {
                                obj1: objects[i],
                                obj2: objects[j],
                                collided: true
                            };

                            this.eventBus.emit("explosion", collided);
                        }
                    }
                }
            }
        }

        return collided;
    }

    /** Возвращает список сфер для проверки:
     * - для Comet → одна "сфера"
     * - для CometTail → голова + все сегменты хвоста
     */
    private getCollisionParts(obj: any): { position: any; radius: number }[] {
        // тип A: Comet
        if (obj.points && obj.pointCount !== undefined) {
            return [
                {
                    position: obj.points.position,
                    radius: obj.radius
                }
            ];
        }

        // тип B: CometTail
        if (obj.head && obj.tail) {
            const parts = [];

            // голова
            parts.push({
                position: obj.head.position,
                radius: (obj.head.geometry as any).parameters.radius
            });

            // хвост
            for (const segment of obj.tail) {
                parts.push({
                    position: segment.position,
                    radius: (segment.geometry as any).parameters.radius
                });
            }

            return parts;
        }

        return [];
    }
}
