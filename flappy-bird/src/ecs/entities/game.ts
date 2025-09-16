import { Entity } from "../entity";
import { GameStateComponent, InputComponent } from "../components";

export function createGameEntity(id: number): Entity {
    const entity = new Entity(id);

    const game = new GameStateComponent();
    const input = new InputComponent();

    entity.addComponent("game", game)
    .addComponent("input", input);

    return entity;
}
