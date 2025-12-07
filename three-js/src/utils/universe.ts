import * as THREE from "three";
import type { SceneManager } from "../core/SceneManager";

export function randomPointInUniverse(rMin: number, rMax: number): THREE.Vector3 {
  // равномерное распределение по объему
  const r = Math.cbrt(Math.random() * (rMax**3 - rMin**3) + rMin**3);

  const u = Math.random() * 2 - 1;
  const theta = Math.random() * 2 * Math.PI;

  const sqrtTerm = Math.sqrt(1 - u * u);

  const x = r * sqrtTerm * Math.cos(theta);
  const y = r * sqrtTerm * Math.sin(theta);
  const z = r * u;

  return new THREE.Vector3(x, y, z);
}

export function getSceneObjectByName(name: string, sceneManager: SceneManager): THREE.Object3D | null {
  const obj = sceneManager.scene.getObjectByName(name);
  return obj || null;
}