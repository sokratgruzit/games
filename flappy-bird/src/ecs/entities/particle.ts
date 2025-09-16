import { Entity } from "../entity";
import { 
    PositionComponent, 
    ScaleComponent, 
    ColorComponent, 
    VelocityComponent,
    TypeComponent
} from "../components";

export function createParticleEntity(id: number, x: number, y: number, color: string, type: string): Entity {
    const entity = new Entity(id);

    const compType = new TypeComponent(type);
    const position = new PositionComponent(x, y + 20);
    const partColor = new ColorComponent(color);
    const velocity = new VelocityComponent(2, (Math.random() * 1) - 0.5); 
    const scale = new ScaleComponent(Math.random() * 7 + 3);

    entity.addComponent("position", position)
    .addComponent("scale", scale)
    .addComponent("color", partColor)
    .addComponent("velocity", velocity)
    .addComponent("type", compType);

    return entity;
}
