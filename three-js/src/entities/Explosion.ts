import * as THREE from "three";

import { fragmentShader, vertexShader } from "../shaders/explosion";

export class Explosion {
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    public points: THREE.Points;

    private time = 0;
    private life = 20; // секунды жизни
    private finished = false;

    constructor(position: THREE.Vector3) {
        this.geometry = this.createGeometry();

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 },
                life: { value: this.life },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.position.copy(position);
        this.points.name = "explosion";
    }

    private createGeometry() {
        const g = new THREE.BufferGeometry();

        const positions: number[] = [];
        const directions: number[] = [];
        const speeds: number[] = [];
        const alphas: number[] = [];

        const count = 1000; // больше частиц — космос плотнее

        for (let i = 0; i < count; i++) {
            // случайное направление
            const dir = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();

            positions.push(0, 0, 0); // старт из центра
            directions.push(dir.x, dir.y, dir.z);

            speeds.push(0.5 + Math.random() * 2.0); // разные скорости

            alphas.push(0.5 + Math.random() * 0.5); // случайная начальная прозрачность
        }

        g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        g.setAttribute("aDir", new THREE.Float32BufferAttribute(directions, 3));
        g.setAttribute("aSpeed", new THREE.Float32BufferAttribute(speeds, 1));
        g.setAttribute("aAlpha", new THREE.Float32BufferAttribute(alphas, 1));

        return g;
    }

    update(delta: number) {
        this.time += delta * 0.01;
        (this.material.uniforms as any).time.value = this.time;

        if (this.time > this.life) this.finished = true;
    }

    isFinished() {
        return this.finished;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
