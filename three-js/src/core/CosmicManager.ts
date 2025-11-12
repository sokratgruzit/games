import * as THREE from "three";

import { BaseEntity } from "../entities/BaseEntity";
import { StarCloud } from "../entities/StarCloud";
import { GasCloud } from "../entities/GasCloud";

export class CosmicManager {
    private starCloud: StarCloud;
    private gasClouds: GasCloud[];

    constructor() {
        this.starCloud = new StarCloud();
        this.gasClouds = [];

        const gasColors = [
            new THREE.Color().setHSL(0.58, 0.3, 0.5),
            new THREE.Color().setHSL(0.15, 0.3, 0.5),
            new THREE.Color().setHSL(0.0, 0.0, 0.5),
            new THREE.Color().setHSL(0.83, 0.3, 0.5)
        ];

        for (let i = 0; i < 4; i++) {
            this.gasClouds.push(new GasCloud(1000, gasColors[i]));
        }
    }

    update(delta: number) {
        this.starCloud.update(delta);
        this.gasClouds.forEach(c => c.update(delta));
    }

    getEntities(): BaseEntity[] {
        return [this.starCloud, ...this.gasClouds];
    }
}
