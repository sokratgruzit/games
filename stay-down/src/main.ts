import { Game } from "./stay-down-game";

import "./style.css";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" />
`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const game = new Game(canvas);
game.start();

