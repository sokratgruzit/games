import * as THREE from "three";

export abstract class BaseEntity {
    mesh: THREE.Object3D;

    constructor(mesh: THREE.Object3D) {
        this.mesh = mesh;
    }

    abstract update(delta: number): void;
}
