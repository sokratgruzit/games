import type { TetrominoCell } from "./types";

export class Collisions {
    // проверка: коснется ли фигура пола
    groundCollision(cells: TetrominoCell[], canvas: HTMLCanvasElement): boolean {
        return cells.some(c => c.targetY + c.height >= canvas.height);
    }

    // проверка: коснется ли фигура стены
    wallCollision(cells: TetrominoCell[], canvas: HTMLCanvasElement, dir: "left" | "right"): boolean {
        return cells.some(c =>
            dir === "left" ? c.targetX <= 0 : c.targetX + c.width >= canvas.width
        );
    }

    // проверка: коснется ли фигура уже зафиксированных клеток (по вертикали)
    blockCollision(cells: TetrominoCell[], grid: TetrominoCell[], step: number): boolean {
        for (const c of cells) {
            const nextY = c.targetY + step;

            for (const s of grid) {
                const overlapX = c.targetX < s.x + s.width && c.targetX + c.width > s.x;
                const touchingY = nextY + c.height > s.y && c.targetY < s.y;

                if (overlapX && touchingY) {
                    return true;
                }
            }
        }
        return false;
    }

    // проверка боковой коллизии с зафиксированными клетками
    horizontalBlockCollision(
        cells: TetrominoCell[],
        grid: TetrominoCell[],
        dir: "left" | "right",
        step: number
    ): boolean {
        for (const c of cells) {
            const nextX = dir === "left" ? c.targetX - step : c.targetX + step;

            for (const s of grid) {
                const overlapY = c.targetY < s.y + s.height && c.targetY + c.height > s.y;
                if (!overlapY) continue;

                if (dir === "left") {
                    // следующая левая граница меньше правой границы блока, и текущая правая ещё правее блока
                    if (nextX < s.x + s.width && c.targetX + c.width > s.x + s.width) {
                        return true;
                    }
                } else {
                    // следующая правая граница больше левой границы блока, и текущая левая ещё левее блока
                    if (nextX + c.width > s.x && c.targetX < s.x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
