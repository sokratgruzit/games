import * as THREE from "three";

export class Sun {
    private geometry: THREE.SphereGeometry;
    private material: THREE.MeshBasicMaterial;
    public points: THREE.Mesh;
    private time = 0;
    private angle = 0;
    public name: string = "";
    public radius: number = 100;
    public segments: number = 32;

    public speed: number;

    constructor(name: string) {
        this.name = name;
        this.speed = 0.3;

        // создаем начальную геометрию
        this.geometry = this.createGeometry();

        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

        this.points = new THREE.Mesh(this.geometry, this.material);
        this.points.name = `comet-${name}`;
    }

    private createGeometry(): THREE.SphereGeometry {
        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);

        return geometry;
    }

    private rebuildGeometry() {
        const geom = this.createGeometry();
        this.points.geometry.dispose();
        this.points.geometry = geom;
    }

    setSegments(segments: number) {
        this.segments = segments;
        this.rebuildGeometry();
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setRadius(radius: number) {
        this.radius = radius;
        this.rebuildGeometry();
    }

    update(delta: number) {
        this.time += delta;
        this.angle += delta * this.speed * 0.001;
    }

    dispose() {
        this.points.geometry.dispose();
        this.material.dispose();
    }
}
