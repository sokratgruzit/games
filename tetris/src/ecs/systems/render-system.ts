import type { Entity } from "../entity";
import type { TetrominoCell } from "../../types";
import { TetrominoComponent } from "../components";

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(entities: Entity[], grid: TetrominoCell[]) {
        for (const entity of entities) {
            const tetromino = entity.getComponent<TetrominoComponent>("tetromino");

            if (tetromino) {
                for (let cell of tetromino.cells) {
                    this.ctx.fillStyle = cell.color;
                    this.ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
                }
                continue;
            }
        }

        for (const c of grid) {
            this.ctx.fillStyle = c.color ?? "#ccc";
            this.ctx.fillRect(c.x, c.y, c.width, c.height);
        }
    }
}
