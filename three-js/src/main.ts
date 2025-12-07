import { SceneManager } from "./core/SceneManager";
import { EventBus } from "./core/EventBus";
import { LightManager } from "./core/LightManager";
import { CosmosEntity } from "./entities/CosmosEntity";
import { UIManager } from "./ui/UIManager";
import { Time } from "./core/Time";
import { Root } from "./core/Root";

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<canvas id="canvas"></canvas>`;

const eventBus = new EventBus();
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const sceneManager = new SceneManager(canvas, eventBus);
new LightManager(sceneManager.scene);
new UIManager(eventBus);
const time = new Time();

const cosmos = new CosmosEntity();
sceneManager.addEntity(cosmos);


time.setUpdate((dt) => {
  sceneManager.update(dt);
  Root.update(dt);
});

time.setRender(() => {
  sceneManager.render();
});

time.start();
