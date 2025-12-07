import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/comet";
import { Orbit } from "./Orbit";

export class Planet {
    public orbit: Orbit;
    private geometry: THREE.SphereGeometry;
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

    private createGeometry(): THREE.SphereGeometry {
        const geometry = new THREE.SphereGeometry(1000, 16, 16);

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
