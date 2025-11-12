import * as THREE from "three";
import type { SceneManager } from "../core/SceneManager";

export function randomPointInUniverse(rMin: number, rMax: number): THREE.Vector3 {
    const r = Math.random() * (rMax - rMin) + rMin; // радиус
    const u = Math.random() * 2 - 1;                // [-1,1]
    const theta = Math.random() * 2 * Math.PI;     // [0, 2π]
    const phi = Math.acos(u);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

export function getSceneObjectByName(name: string, sceneManager: SceneManager): THREE.Object3D | null {
  const obj = sceneManager.scene.getObjectByName(name);
  return obj || null;
}