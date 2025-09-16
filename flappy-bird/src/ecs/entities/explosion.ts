import { Entity } from "../entity";
import { 
    PositionComponent, 
    SpriteComponent, 
    ExplosionComponent, 
    SizeComponent,
} from "../components/index";
import type { SpriteJSON } from "../../types";

export function createExplosionEntity(id: number, x: number, y: number, spriteJSON: SpriteJSON, scale: number): Entity {
    const entity = new Entity(id);

    const position = new PositionComponent(x, y);
    const explosion = new ExplosionComponent();
    const sprite = new SpriteComponent(`assets/sprites/${spriteJSON.meta.image}`, Object.values(spriteJSON.frames), scale);
    const size = new SizeComponent(sprite.width, sprite.height);

    entity.addComponent("position", position)
    .addComponent("explosion", explosion)
    .addComponent("sprite", sprite)
    .addComponent("size", size);

    return entity;
}
