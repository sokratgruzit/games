import { createParticleEntity } from "../ecs/entities";
import type { Entity } from "../ecs/entity";

export class ParticleManager {
    entities: Entity[] = [];
    private idCounter = 1;

    generate(x: number, y: number, color: string) {
        const entity = createParticleEntity(this.idCounter++, x, y, color);
        this.entities.unshift(entity);
        
        if (this.entities.length > 200) {
            this.entities.length = 200;
        }
    }

    clear() {
        this.entities.length = 0;
    }
}
