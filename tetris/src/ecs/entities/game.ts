import { Entity } from "../entity";
import { GameStateComponent } from "../components";

export function createGameEntity(id: number): Entity {
    const entity = new Entity(id);

    const game = new GameStateComponent();

    entity.addComponent("game", game);

    return entity;
}
