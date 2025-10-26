import { Entity } from "../entity";
import { TetrominoComponent, TypeComponent } from "../components/index";

export function createTetrominoEntity(id: number, type: string): Entity {
    const entity = new Entity(id);

    const tetromino = new TetrominoComponent();
    const compType = new TypeComponent(type);

    entity.addComponent("tetromino", tetromino)
    .addComponent("type", compType);

    return entity;
}
