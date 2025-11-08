import { Entity } from "../entity";
import { TetrominoComponent } from "../components/index";

export function createTetrominoEntity(id: number, type: string): Entity {
    const entity = new Entity(id);

    const tetromino = new TetrominoComponent(type);

    entity.addComponent("tetromino", tetromino);

    return entity;
}
