import type { Entity } from "../entity";
import type { TetrominoCell } from "../../types";
import { 
    TetrominoComponent,
    TypeComponent
} from "../components";

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(entities: Entity[], grid: TetrominoCell[]) {
        for (const entity of entities) {
            const type = entity.getComponent<TypeComponent>("type");
            const tetromino = entity.getComponent<TetrominoComponent>("tetromino");

            if (tetromino) {
                if (type && (type.type === "line")) {
                    const minX = Math.min(...tetromino.cells.map(c => c.x));
                    const maxX = Math.max(...tetromino.cells.map(c => c.x + c.width));

                    for (let cell of tetromino.cells) {
                        const t = (cell.x - minX) / (maxX - minX || 1);
                        const hue = (tetromino.baseHue + t * 60) % 360;
                        const color = `hsl(${hue}, 80%, 50%)`;

                        cell.color = color;
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
                    }
                    continue;
                }
            }
        }

        for (const c of grid) {
            this.ctx.fillStyle = c.color ?? "#ccc";
            this.ctx.fillRect(c.x, c.y, c.width, c.height);
        }
    }
}
