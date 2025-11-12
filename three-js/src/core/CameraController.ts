import * as THREE from "three";

export class CameraController {
    camera: THREE.PerspectiveCamera;

    constructor(scene: THREE.Scene) {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.camera.position.set(0, 0, 1000);
        this.camera.lookAt(0, 0, 0);
        scene.userData.camera = this.camera;
    }

    update(_delta: number) {
        // тут потом добавим плавные переходы, управление орбитой и т.д.
    }
}
