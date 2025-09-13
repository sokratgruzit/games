import "./style.css";

const appDiv = document.querySelector<HTMLDivElement>("#app");

if (!appDiv) {
  throw new Error("Не найден элемент с id 'app'");
}

appDiv.innerHTML = "";

import Phaser from "phaser";
import { GameScene } from "./scenes/game"; 

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: "app", 
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false }
    },
    scene: GameScene
};

new Phaser.Game(config);
