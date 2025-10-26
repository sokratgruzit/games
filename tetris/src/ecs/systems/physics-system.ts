import type { Entity } from "../entity";
import type { Pivot, TetrominoCell } from "../../types";
import { 
    TetrominoComponent,
    // TypeComponent
} from "../components";

import { easeOutCubic, lerp } from "../../utils";

export class PhysicsSystem {
    update(entities: Entity[], canvas: HTMLCanvasElement, step: number) {
        for (const entity of entities) {
            // const type = entity.getComponent<TypeComponent>("type");
            const tetromino = entity.getComponent<TetrominoComponent>("tetromino");
            if (tetromino) {
                this.findPivot(tetromino);
                this.fallBy(canvas, step, tetromino);
                this.updatePositions(performance.now(), 0.18, tetromino);
            }
        }
    }

    // Поворачиваем: НЕ меняем x/y напрямую, ставим targetX/targetY
    rotate(cell: TetrominoCell, dir: "left" | "right", pivot: Pivot) {
        const cx = cell.targetX + cell.width / 2;
        const cy = cell.targetY + cell.height / 2;
        const dx = cx - pivot.x;
        const dy = cy - pivot.y;

        let rotatedDx: number;
        let rotatedDy: number;

        if (dir === "left") {
            rotatedDx = -dy;
            rotatedDy = dx;
        } else {
            rotatedDx = dy;
            rotatedDy = -dx;
        }

        const newCenterX = pivot.x + rotatedDx;
        const newCenterY = pivot.y + rotatedDy;

        cell.targetX = newCenterX - cell.width / 2;
        cell.targetY = newCenterY - cell.height / 2;
        
        if (dir === "left") {
            cell.targetX -= cell.shift;
        } else {
            cell.targetX += cell.shift;
        }
    }

    // падение — увеличивает targetY
    // падение — увеличивает targetY, но не даёт выйти за нижнюю границу
    fallBy(canvas: HTMLCanvasElement, step: number, tetromino: TetrominoComponent): boolean {
        const maxY = Math.max(...tetromino.cells.map(c => c.targetY + c.height));

        // если после шага фигура выходит за нижнюю границу
        if (maxY + step > canvas.height) {
            const shift = canvas.height - maxY; // сколько остаётся до пола
            for (let c of tetromino.cells) {
                c.targetY += shift; // аккуратно опускаем ровно на пол
            }
            return false; // дальше падать нельзя
        }

        // обычное падение
        for (let c of tetromino.cells) {
            c.targetY += step;
        }
        return true;
    }

    // вычисляем pivot по целевым позициям (чтобы поворот смотрел на target)
    findPivot(tetromino: TetrominoComponent) {
        const minX = Math.min(...tetromino.cells.map(c => c.targetX));
        const maxX = Math.max(...tetromino.cells.map(c => c.targetX + c.width));
        const minY = Math.min(...tetromino.cells.map(c => c.targetY));
        const maxY = Math.max(...tetromino.cells.map(c => c.targetY + c.height));

        tetromino.pivot.x = (minX + maxX) / 2;
        tetromino.pivot.y = (minY + maxY) / 2;
    }

    // старт волны (вызывать после того, как прописаны все targetX/targetY)
    startWave(duration = 150, tetromino: TetrominoComponent) {
        tetromino.waveActive = true;
        tetromino.waveStart = performance.now();
        tetromino.waveDuration = duration;
        // snapshot стартовых позиций
        for (let c of tetromino.cells) {
            c.startX = c.x;
            c.startY = c.y;
        }
    }

    updatePositions(
        now: number, 
        fallSmooth = 0.18,
        tetromino: TetrominoComponent
    ) {
        if (tetromino.waveActive) {
            let allDone = true;
            for (let c of tetromino.cells) {
                const localT = Math.max(0, now - tetromino.waveStart - c.delay);
                const raw = Math.min(1, localT / tetromino.waveDuration);
                const t = easeOutCubic(raw);
                // интерполируем от start -> target с учётом t
                c.x = lerp(c.startX, c.targetX, t);
                c.y = lerp(c.startY, c.targetY, t);
                if (raw < 1) allDone = false;
            }
            if (allDone) {
                // конец волны — снапим точно
                tetromino.waveActive = false;
                for (let c of tetromino.cells) {
                    c.x = c.targetX;
                    c.y = c.targetY;
                }
            }
        } else {
            // волна не активна: по X — чётко совпадаем с target; по Y — сглаживаем падение
            for (let c of tetromino.cells) {
                // по X — snap, чтобы не было дрейфа
                c.x = c.targetX;
                // по Y — плавный докат (чтобы падение выглядело не мгновенным)
                c.y += (c.targetY - c.y) * fallSmooth;
            }
        }
    }

    // сместить влево/вправо логически (меняем target)
    // step может быть отрицательным (влево) или положительным (вправо)
    moveHorizontalBy(step: number, canvas: HTMLCanvasElement, tetromino: TetrominoComponent): boolean {
        const minX = Math.min(...tetromino.cells.map(c => c.targetX));
        const maxX = Math.max(...tetromino.cells.map(c => c.targetX + c.width));

        // проверка границ до сдвига
        if (minX + step < 0 || maxX + step > canvas.width) {
            return false; // нельзя двигать — упрёмся в стену
        }

        for (let c of tetromino.cells) {
            c.targetX += step;
        }
        return true;
    }
}
