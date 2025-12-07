import * as THREE from "three";

import { vertexShader, fragmentShader } from "../shaders/gasCloud";

export class GasCloud {
    public geometry!: THREE.BufferGeometry;
    public material!: THREE.ShaderMaterial;
    public points!: THREE.Points;
    public time = 0;
    public speed: number = 0.0003;

    public name: string = "";
    public count: number = 0;
    public scaleX: number = 10;
    public scaleY: number = 0;
    public scaleZ: number = 0;
    public posX: number = 0;
    public posY: number = 0;
    public posZ: number = 900;
    public color: string = "";
    public uniforms: any = {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#ffffff") }
    }

    constructor(count = 3000, color = "#ffffff", name: string) {
        this.name = name;
        this.count = count;
        this.color = color;

        this.geometry = this.createGeometry();
        this.material = this.createMaterial();
        this.points = new THREE.Points(this.geometry, this.material);
        this.points.position.set(this.posX, this.posY, this.posZ);
    }

    createGeometry() {
        const positions: number[] = [];
        const phases: number[] = [];
        const scales: number[] = [];

        for (let i = 0; i < this.count; i++) {
            // точки внутри компактного куба [-1,1] и потом растягиваем mesh.scale
            const x = (Math.random() - 0.5) * Math.round(Math.random() * 10 + this.scaleX);
            const y = (Math.random() - 0.5) * Math.round(Math.random() * 5 + this.scaleY);
            const z = (Math.random() - 0.5) * Math.round(Math.random() * 3 + this.scaleZ);

            positions.push(x, y, z);
            phases.push(Math.random() * Math.PI * 2);
            scales.push(Math.random() * 0.5 + 0.5);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
        geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));

        return geometry;
    }

    createMaterial() {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false
        });

        return material;
    }

    setColor(color: string) {
        this.color = color;
        this.material.uniforms.uColor.value = new THREE.Color(color);
    }

    setCount(count: number) {
        this.count = count;
        this.points.geometry.dispose();
        this.points.geometry = this.createGeometry();
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setScale(scale: { x?: number, y?: number, z?: number }) {
        if (scale.x !== undefined) this.scaleX = scale.x;
        if (scale.y !== undefined) this.scaleY = scale.y;
        if (scale.z !== undefined) this.scaleZ = scale.z;
        this.points.geometry.dispose();
        this.points.geometry = this.createGeometry();
    }

    setPosition(pos: { x?: number, y?: number, z?: number }) {
        if (pos.x !== undefined) this.posX = pos.x;
        if (pos.y !== undefined) this.posY = pos.y;
        if (pos.z !== undefined) this.posZ = pos.z;
        this.points.position.set(this.posX, this.posY, this.posZ);
    }

    update(delta: number) {
        this.time += delta * this.speed;
        this.material.uniforms.uTime.value = this.time;
    }

    dispose() {
        this.points.geometry.dispose();
        this.material.dispose();
    }
}
