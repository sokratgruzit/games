import * as THREE from "three";

export class Orbit {
    public object3D: THREE.LineLoop;
    public name: string;
    public radiusX: number;
    public radiusZ: number;
    public speed: number;
    public color: number;

    public rotationEuler = new THREE.Euler(0, 0, 0);
    // private angle = 0;

    constructor(name: string, radiusX = 500, radiusZ = 500, speed = 0.01, color = 0xffffff) {
        this.name = name;
        this.radiusX = radiusX;
        this.radiusZ = radiusZ;
        this.speed = speed;
        this.color = color;

        const material = new THREE.LineBasicMaterial({ color });
        const geometry = this.createGeometry();
        this.object3D = new THREE.LineLoop(geometry, material);
        this.object3D.name = `orbit-${name}`;
        this.object3D.rotation.copy(this.rotationEuler);
    }

    private createGeometry() {
        const segments = 128;
        const vertices: number[] = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            vertices.push(Math.cos(theta) * this.radiusX, 0, Math.sin(theta) * this.radiusZ);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geometry;
    }

    update(_delta: number) {
        // this.angle += this.speed * delta;
        // const x = Math.cos(this.angle) * this.radiusX;
        // const z = Math.sin(this.angle) * this.radiusZ;
        // this.object3D.position.set(x, 0, z);
        
    }

    setColor(color: string | number) {
        if (typeof color === "string") this.color = parseInt(color.replace('#','0x'));
        else this.color = color;
        (this.object3D.material as THREE.LineBasicMaterial).color.set(this.color);
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setEllipticalX(rx: number) {
        this.radiusX = rx;
        this.rebuildGeometry();
    }

    setEllipticalZ(rz: number) {
        this.radiusZ = rz;
        this.rebuildGeometry();
    }

    setRotation(rotation: { x?: number, y?: number, z?: number }) {
        if (rotation.x !== undefined) this.rotationEuler.x = rotation.x;
        if (rotation.y !== undefined) this.rotationEuler.y = rotation.y;
        if (rotation.z !== undefined) this.rotationEuler.z = rotation.z;
        this.object3D.rotation.copy(this.rotationEuler);
    }

    private rebuildGeometry() {
        const geom = this.createGeometry();
        this.object3D.geometry.dispose();
        this.object3D.geometry = geom;
        this.object3D.rotation.copy(this.rotationEuler);
    }

    dispose() {
        this.object3D.geometry.dispose();
        const mats = Array.isArray(this.object3D.material) ? this.object3D.material : [this.object3D.material];
        mats.forEach(m => m.dispose());
    }
}
