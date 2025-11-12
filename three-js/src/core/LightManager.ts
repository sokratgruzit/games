import * as THREE from "three";

export class LightManager {
    constructor(scene: THREE.Scene) {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(5, 10, 7.5);
        scene.add(ambient, dir);
    }
}
