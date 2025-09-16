import { Entity } from "../entity";
import { 
    PositionComponent, 
    SizeComponent, 
    ObstacleComponent, 
    ColorComponent, 
    VelocityComponent,
    BoundaryComponent,
    TypeComponent
} from "../components";

export function createObstacleEntity(id: number, canvasWidth: number, canvasHeight: number, color: string, width: number = 20, type: string): Entity {
    const entity = new Entity(id);

    const top = (Math.random() * canvasHeight / 3) + 20;
    const bottom = (Math.random() * canvasHeight / 3) + 20;

    const compType = new TypeComponent(type);
    const position = new PositionComponent(canvasWidth, 0);
    const size = new SizeComponent(width, top + bottom);
    const obstacle = new ObstacleComponent(top, bottom);
    const obsColor = new ColorComponent(color);
    const velocity = new VelocityComponent(2, 0); 
    const boundary = new BoundaryComponent(canvasWidth, canvasHeight);

    entity.addComponent("position", position)
    .addComponent("size", size)
    .addComponent("obstacle", obstacle)
    .addComponent("color", obsColor)
    .addComponent("velocity", velocity)
    .addComponent("boundary", boundary)
    .addComponent("type", compType);

    return entity;
}
