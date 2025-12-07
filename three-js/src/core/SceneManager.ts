import * as THREE from "three";

import type { BaseEntity } from "../entities/BaseEntity";
import { Orbit } from "../entities/Orbit";
import { Comet } from "../entities/Comet";
import { Modal } from "../ui/Modal";
import { Smoke } from "../entities/Smoke";
import { CometTail } from "../entities/CometTail";
import type { EventBus } from "./EventBus";
import { CollisionsManager } from "./CollisionsManager";
import type { Collided } from "../types/types";
import { Explosion } from "../entities/Explosion";
import { CameraController } from "./CameraController";
import { GasCloud } from "../entities/GasCloud";
import { Planet } from "../entities/Planet";
import { Sun } from "../entities/Sun";

export class SceneManager {
    scene: THREE.Scene;
    cameraController: CameraController;
    private renderer: THREE.WebGLRenderer;
    private entities: BaseEntity[] = [];
    private eventBus: EventBus;
    public orbitList: Orbit[] = [];
    public cometList: Comet[] = [];
    public gasClouds: GasCloud[] = [];
    public smoke: Smoke;
    public collisions: CollisionsManager;
    public explosions: Explosion[] = [];
    public planets: Planet[] = [];
    public sun: Sun | null = null;

    constructor(canvas: HTMLCanvasElement, eventBus: EventBus) {
        this.eventBus = eventBus;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.collisions = new CollisionsManager(this.eventBus);
        this.cameraController = new CameraController(this.scene, this.renderer);

        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.eventBus.on("addOrbit", (name, orbitList, handler) => {
            const orbit = new Orbit(name, 500, 500, 0.01, 0xffffff);
            orbitList.push(orbit);

            this.scene.add(orbit.object3D);
            this.updateOrbitList(orbitList);

            handler(name, orbit);

            Modal(`Orbit "${name}" added.`);
        });

        this.eventBus.on("addGasCloud", (name, gasClouds, handler) => {
            const cloud = new GasCloud(1000, "#ffffff", name);
            gasClouds.push(cloud);

            this.scene.add(cloud.points);
            this.gasClouds = gasClouds;

            handler(name, cloud);

            Modal(`Gas cloud "${name}" added.`);
        });

        this.eventBus.on("addComet", (name, orbitName, cometList, cometType, handler) => {
            const orbit = this.orbitList.filter(o => o.name === orbitName);
            let comet = null;

            if (!orbit) return Modal(`Can't add comet "${name}" to not existing orbit.`);

            if (cometType === "round") {
                comet = new Comet(orbitName, name, orbit[0], cometType);
            } else {
                comet = new CometTail(orbitName, name, orbit[0], cometType);
            }

            this.scene.add(comet.points);
            
            cometList.push(comet);

            this.updateCometList(cometList);

            handler(name);

            Modal(`Comet "${name}" added.`);
        });

        this.eventBus.on("addPlanet", (name, orbitName, planets, handler) => {
            const orbit = this.orbitList.filter(o => o.name === orbitName);
            let planet = new Planet(orbitName, name, orbit[0]);

            if (!orbit) return Modal(`Can't add planet "${name}" to not existing orbit.`);

            this.scene.add(planet.points);
            
            planets.push(planet);

            handler(name);

            Modal(`Comet "${name}" added.`);
        });

        this.eventBus.on("addSun", (name, uiSun, handler) => {
            if (this.sun) return Modal(`Sun "${name}" is already added.`);

            console.log(uiSun)

            let sun = new Sun(name);

            this.scene.add(sun.points);
            
            this.sun = sun;
            uiSun = sun;

            handler(name);

            Modal(`Sun "${name}" added.`);
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

        this.eventBus.on("removeGasCloud", (name, gasClouds: GasCloud[], cloud, handler) => {
            this.scene.remove(cloud.points);

            const index = gasClouds.findIndex(c => c.name === name);
            
            if (index !== -1) gasClouds.splice(index, 1); 

            this.gasClouds = gasClouds;
            
            cloud.dispose();

            handler();

            Modal(`Gas cloud "${name}" removed.`);
        });

        this.eventBus.on("explosion", (collided: Collided) => {
            if (collided.collided) {
                if (collided.obj1 && collided.obj1.points) {
                    const index = this.cometList.findIndex(c => c.name === collided.obj1?.name);
                    if (index !== -1) this.cometList.splice(index, 1); 
                    this.scene.remove(collided.obj1?.points);
                    collided.obj1?.dispose();
                    this.eventBus.emit("updateComets", this.cometList);
                }

                if (collided.obj2 && collided.obj2.points) {
                    const index = this.cometList.findIndex(c => c.name === collided.obj2?.name);
                    if (index !== -1) this.cometList.splice(index, 1); 
                    this.scene.remove(collided.obj2?.points);
                    collided.obj2?.dispose();
                    this.eventBus.emit("updateComets", this.cometList);
                }

                const createExplosion = (obj: Comet | null | CometTail) => {
                    if (!obj || !obj.points) return;

                    const exp = new Explosion(obj.points.position.clone());
                    this.scene.add(exp.points);
                    this.explosions.push(exp); // массив взрывов

                    const index = this.cometList.findIndex(c => c.name === obj.name);
                    if (index !== -1) this.cometList.splice(index, 1);

                    this.scene.remove(obj.points);
                    obj.dispose();
                    this.eventBus.emit("updateComets", this.cometList);
                };

                createExplosion(collided.obj1);
                createExplosion(collided.obj2);
            }
        });

        this.smoke = new Smoke(this.scene);
    }

    addEntity(entity: BaseEntity) {
        this.entities.push(entity);
        this.scene.add(entity.mesh);  // предполагаем, что у BaseEntity есть mesh
    }

    update(delta: number) {
        this.sun?.update(delta);

        for (const orbit of this.orbitList) {
            orbit.update(delta);
        }

        for (const cloud of this.gasClouds) {
            cloud.update(delta);
        }

        for (const comet of this.cometList) {
            comet.update(delta);
        }

        for (const entity of this.entities) {
            entity.update(delta);
        }

        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const e = this.explosions[i];
            e.update(delta);

            if (e.isFinished()) {
                this.scene.remove(e.points);
                e.dispose();
                this.explosions.splice(i, 1);
            }
        }

        this.smoke.update(delta);
        this.collisions.checkCollisions(this.cometList);
        this.cameraController.update(delta);
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
