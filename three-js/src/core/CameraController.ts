import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class CameraController {
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            50000
        );
        this.camera.position.set(0, 0, 1000);
        this.camera.lookAt(0, 0, 0);

        // Добавляем OrbitControls
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.enableDamping = true; // плавное движение
        this.controls.dampingFactor = 0.1;
        this.controls.enableZoom = true; // включен зум
        this.controls.zoomSpeed = 1.2;
        this.controls.enablePan = true;  // можно панорамировать
        this.controls.rotateSpeed = 0.7;

        scene.userData.camera = this.camera;

        window.addEventListener("resize", () => this.onResize(), false);
    }

    update(_delta: number) {
        this.controls.update(); // плавное обновление орбита
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
