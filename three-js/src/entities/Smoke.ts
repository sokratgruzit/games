import * as THREE from "three";

export class Smoke {
    private geometry: THREE.PlaneGeometry;
    private material: THREE.MeshLambertMaterial;
    private mesh: THREE.Mesh = new THREE.Mesh();
    private smokeTexture: any;
    private smokeParticles: any = [];
    public particles: any[] = [];

    constructor(scene: THREE.Scene) {
        this.smokeTexture = new THREE.TextureLoader().load(
            import.meta.env.BASE_URL + "assets/textures/smoke.png"
        );

        this.geometry = new THREE.PlaneGeometry(300, 300);

        this.material = new THREE.MeshLambertMaterial({
            color: new THREE.Color("rgba(101, 101, 142, 1)"),
            map: this.smokeTexture,
            transparent: true,
            opacity: 0.2,         // почти прозрачный
            depthWrite: false,     // не пишет в z-буфер
            blending: THREE.AdditiveBlending // светящийся, мягкий
        });

        for (let p = 0; p < 150; p++) {
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(
                Math.random() * 800 - 250,
                Math.random() * 800 - 250,
                Math.random() * 4000 - 100
            );
            this.mesh.rotation.z = Math.random() * 360;
            scene.add(this.mesh);
            this.smokeParticles.push(this.mesh);
        }
    }

    evolveSmoke(delta: number) {
        let sp = this.smokeParticles.length;
        while (sp--) {
            this.smokeParticles[sp].rotation.z += delta * 0.0002;
        }
    }

    update(delta: number) {
        this.evolveSmoke(delta);
    }
}
