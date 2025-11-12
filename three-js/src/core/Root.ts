import * as THREE from "three";

export class Root {
    private static instance: THREE.Object3D;

    static get(): THREE.Object3D {
        if (!Root.instance) {
            Root.instance = new THREE.Object3D();
            Root.instance.position.set(0, 0, 0);
        }
        return Root.instance;
    }

    static update(delta: number) {
        if (Root.instance) {
            Root.instance.rotation.y += delta * 0.00002;
        }
    }
}
