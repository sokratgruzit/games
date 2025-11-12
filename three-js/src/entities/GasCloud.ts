import * as THREE from "three";
import { BaseEntity } from "./BaseEntity";
import { vertexShader, fragmentShader } from "../shaders/gasCloud";
import { randomPointInUniverse } from "../utils/universe";
import { UCONF } from "../constants/universeConfig";

export class GasCloud extends BaseEntity {
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private points: THREE.Points;
    private time = 0;

    constructor(count = 1000, color: THREE.Color = new THREE.Color(0x99bbff)) {
        const root = new THREE.Object3D();
        super(root);

        const positions: number[] = [];
        const phases: number[] = [];
        const scales: number[] = [];

        for (let i = 0; i < count; i++) {
            // точки внутри компактного куба [-1,1] и потом растягиваем mesh.scale
            const x = (Math.random() - 0.5) * Math.round(Math.random() * 10 + 10);
            const y = (Math.random() - 0.5) * Math.round(Math.random() * 5);
            const z = (Math.random() - 0.5) * Math.round(Math.random() * 3);

            positions.push(x, y, z);
            phases.push(Math.random() * Math.PI * 2);
            scales.push(Math.random() * 0.5 + 0.5);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
        this.geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: color }
            },
            transparent: true,
            depthWrite: false
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.mesh.add(this.points);

        const pos = randomPointInUniverse(UCONF.zones.intermediate.min, UCONF.zones.intermediate.max);
        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.scale.set(50, 30, 50);
    }

    update(delta: number) {
        this.time += delta * 0.0003;
        this.material.uniforms.uTime.value = this.time;
    }
}
