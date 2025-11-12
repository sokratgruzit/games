import { BaseEntity } from "./BaseEntity";
import { CosmicManager } from "../core/CosmicManager";
import { Root } from "../core/Root";

export class CosmosEntity extends BaseEntity {
    private manager: CosmicManager;

    constructor() {
        const root = Root.get();
        super(root);

        this.manager = new CosmicManager();
        // добавляем все сущности в root.mesh
        this.manager.getEntities().forEach(entity => root.add(entity.mesh));
    }

    update(delta: number) {
        this.manager.update(delta);
    }
}
