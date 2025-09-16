import { Entity } from "../entity";
import { 
    PositionComponent, 
    VelocityComponent, 
    SpriteComponent, 
    BirdComponent, 
    SizeComponent,
    InputComponent,
    BoundaryComponent,
    PhysicsComponent
} from "../components/index";
import type { SpriteJSON } from "../../types";

export function createBirdEntity(id: number, canvasWidth: number, canvasHeight: number, spriteJSON: SpriteJSON, scale: number): Entity {
    const entity = new Entity(id);

    const input = new InputComponent();
    const position = new PositionComponent(150, canvasHeight / 2);
    const velocity = new VelocityComponent(0, 0);
    const birdData = new BirdComponent();
    const physics = new PhysicsComponent(0, 1);
    const boundary = new BoundaryComponent(canvasWidth, canvasHeight);
    const sprite = new SpriteComponent(`assets/sprites/${spriteJSON.meta.image}`, Object.values(spriteJSON.frames), scale);
    const size = new SizeComponent(sprite.width, sprite.height);

    entity.addComponent("position", position)
    .addComponent("input", input)
    .addComponent("velocity", velocity)
    .addComponent("bird", birdData)
    .addComponent("sprite", sprite)
    .addComponent("size", size)
    .addComponent("boundary", boundary)
    .addComponent("physics", physics);

    return entity;
}
