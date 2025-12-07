import { BaseEntity } from "../entities/BaseEntity";
import { StarCloud } from "../entities/StarCloud";

export class CosmicManager {
    private starCloud: StarCloud;

    constructor() {
        this.starCloud = new StarCloud();
    }

    update(delta: number) {
        this.starCloud.update(delta);
    }

    getEntities(): BaseEntity[] {
        return [this.starCloud];
    }
}
