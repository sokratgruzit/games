import { Game } from "./game";

import "./style.css";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" />
  </div>
`;

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;

  canvas.width = 300;
  canvas.height = 660;

  const game = new Game(canvas, ctx);
  
  game.start();
})

