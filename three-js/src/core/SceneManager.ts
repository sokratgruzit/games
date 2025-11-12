import * as THREE from "three";

import type { BaseEntity } from "../entities/BaseEntity";
import { Orbit } from "../entities/Orbit";
import { Comet } from "../entities/Comet";
import { Modal } from "../ui/Modal";
import { Smoke } from "../entities/Smoke";
import type { EventBus } from "./EventBus";

export class SceneManager {
    scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private entities: BaseEntity[] = [];
    private eventBus: EventBus;
    public orbitList: Orbit[] = [];
    public cometList: Comet[] = [];
    public smoke: Smoke;

    constructor(canvas: HTMLCanvasElement, eventBus: EventBus) {
        this.eventBus = eventBus;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.eventBus.on("addOrbit", (name, orbitList, handler) => {
            const orbit = new Orbit(name, 500, 500, 0.01, 0x44ff44);
            orbitList.push(orbit);

            this.scene.add(orbit.object3D);
            this.updateOrbitList(orbitList);

            handler(name, orbit);

            Modal(`Orbit "${name}" added.`);
        });

        this.eventBus.on("addComet", (name, orbitName, cometList, handler) => {
            const orbit = this.orbitList.filter(o => o.name === orbitName);

            if (!orbit) return Modal(`Can't add comet "${name}" to not existing orbit.`);

            const comet = new Comet(orbitName, name, orbit[0]);
            cometList.push(comet);

            this.scene.add(comet.points);
            this.updateCometList(cometList);

            handler(name);

            Modal(`Comet "${name}" added.`);
        });

        this.eventBus.on("removeOrbit", (name, orbitList: Orbit[], orbit, handler) => {
            this.scene.remove(orbit.object3D);

            const index = orbitList.findIndex(o => o.name === name);

            if (index !== -1) orbitList.splice(index, 1); 

            this.updateOrbitList(orbitList);
            
            orbit.dispose();

            handler(name);

            Modal(`Orbit "${name}" removed.`);
        });

        this.eventBus.on("removeComet", (name, cometList: Comet[], comet, handler) => {
            this.scene.remove(comet.points);

            const index = cometList.findIndex(c => c.name === name);

            if (index !== -1) cometList.splice(index, 1); 

            this.updateCometList(cometList);
            
            comet.dispose();

            handler();

            Modal(`Comet "${name}" removed.`);
        });

        this.smoke = new Smoke(this.scene);
    }

    addEntity(entity: BaseEntity) {
        this.entities.push(entity);
        this.scene.add(entity.mesh);  // предполагаем, что у BaseEntity есть mesh
    }

    update(delta: number) {
        for (const orbit of this.orbitList) {
            orbit.update(delta);
        }

        for (const comet of this.cometList) {
            comet.update(delta);
        }

        for (const entity of this.entities) {
            entity.update(delta);
        }

        this.smoke.update(delta);
    }

    render() {
        this.renderer.render(this.scene, this.scene.userData.camera);
    }

    updateOrbitList(orbitList: Orbit[]) {
        this.orbitList = orbitList;
    }

    updateCometList(cometList: Comet[]) {
        this.cometList = cometList;
    }
}
