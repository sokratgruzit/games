import { GameController } from "./game";
import "./style.css";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" />
`;


window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  canvas.width = 600;
  canvas.height = 400;

  const game = new GameController(ctx, canvas.width, canvas.height);
  game.start();
});
