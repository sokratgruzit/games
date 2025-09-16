import { Entity } from "../entity";
import { 
    ImageComponent, 
    SizeComponent, 
    VelocityComponent, 
    PositionComponent, 
    BoundaryComponent,
    TypeComponent
} from "../components";

function loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

export function createImageEntity(id: number, x: number, y: number, speed: number, width: number, height: number, canvasWidth: number, canvasHeight: number, src: string, type: string): Entity {
    const entity = new Entity(id);

    const position = new PositionComponent(x, y);
    const velocity = new VelocityComponent(speed, 0);
    const image = new ImageComponent(loadImage(src));
    const size = new SizeComponent(width, height);
    const boundary = new BoundaryComponent(canvasWidth, canvasHeight);
    const compType = new TypeComponent(type);

    entity.addComponent("position", position)
    .addComponent("velocity", velocity)
    .addComponent("image", image)
    .addComponent("size", size)
    .addComponent("boundary", boundary)
    .addComponent("type", compType);

    return entity;
}
