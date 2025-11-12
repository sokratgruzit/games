import * as THREE from "three";
import { BaseEntity } from "./BaseEntity";
import { UCONF } from "../constants/universeConfig";
import { randomPointInUniverse } from "../utils/universe";
import { vertexShader, fragmentShader } from "../shaders/starCloud";

export class StarCloud extends BaseEntity {
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private points: THREE.Points;
    private time = 0;

    constructor(count = 5000) {
        const root = new THREE.Object3D();
        super(root);

        const positions: number[] = [];
        const brightness: number[] = [];

        for (let i = 0; i < count; i++) {
            const pos = randomPointInUniverse(UCONF.zones.distant.min, UCONF.zones.distant.max);
            positions.push(pos.x, pos.y, pos.z);

            brightness.push(Math.random() * 0.5 + 0.5);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute("aBrightness", new THREE.Float32BufferAttribute(brightness, 1));

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 }
            },
            transparent: true,
            depthWrite: false
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.mesh.add(this.points);
    }

    update(delta: number) {
        this.time += delta;
        this.material.uniforms.uTime.value = this.time;
    }
}
