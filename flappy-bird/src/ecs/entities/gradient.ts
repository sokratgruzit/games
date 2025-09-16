import { Entity } from "../entity";
import { 
    GradientComponent,
    BoundaryComponent,
    TypeComponent
} from "../components";

export function createGradientEntity(id: number, canvasWidth: number, canvasHeight: number, colors: { stop: number; color: string }[], type: string): Entity {
    const entity = new Entity(id);

    const gradient = new GradientComponent(colors);
    const boundary = new BoundaryComponent(canvasWidth, canvasHeight);
    const compType = new TypeComponent(type);

    entity.addComponent("gradient", gradient)
    .addComponent("boundary", boundary)
    .addComponent("type", compType);

    return entity;
}
