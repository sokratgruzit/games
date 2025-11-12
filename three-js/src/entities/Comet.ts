import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/comet";
import { Orbit } from "./Orbit";

export class Comet {
    public orbit: Orbit;
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    public points: THREE.Points;
    private time = 0;
    private angle = 0;
    public name: string = "";
    public radius: number = 100;
    public pointCount: number = 1000;
    public distortion: number = 0.0005;

    public speed: number;
    public belongsTo: string = "";

    constructor(belongsTo: string, name: string, orbit: Orbit) {
        this.belongsTo = belongsTo;
        this.name = name;
        this.orbit = orbit;
        this.speed = 0.3;

        // создаем начальную геометрию
        this.geometry = this.createGeometry();

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: { time: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.name = `comet-${name}`;
    }

    private createGeometry(): THREE.BufferGeometry {
        const geometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const alphas: number[] = [];

        for (let i = 0; i < this.pointCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            positions.push(x, y, z);
            alphas.push(Math.random());
        }

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aAlpha", new THREE.Float32BufferAttribute(alphas, 1));

        return geometry;
    }

    private rebuildGeometry() {
        const geom = this.createGeometry();
        this.points.geometry.dispose();
        this.points.geometry = geom;
    }

    setPointCount(pointCount: number) {
        this.pointCount = pointCount;
        this.rebuildGeometry();
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setDistortion(distortion: number) {
        this.distortion = distortion;
    }

    setRadius(radius: number) {
        this.radius = radius;
        this.rebuildGeometry();
    }

    update(delta: number) {
        this.time += delta;
        this.angle += delta * this.speed * 0.001;

        // координаты кометы на орбите
        const x = Math.cos(this.angle) * this.orbit.radiusX;
        const z = Math.sin(this.angle) * this.orbit.radiusZ;
        const pos = new THREE.Vector3(x, 0, z);

        pos.applyEuler(this.orbit.rotationEuler);

        // смещаем весь Points объект
        this.points.position.copy(pos);

        (this.material.uniforms as any).time.value = this.time * this.distortion;
    }

    dispose() {
        this.points.geometry.dispose();
        this.material.dispose();
    }
}
