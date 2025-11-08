import type { TetrominoCell, Pivot } from "../../types";

export class TetrominoComponent {
    cells: TetrominoCell[];
    pivot: Pivot;
    baseHue: number;
    waveActive: boolean;
    waveStart: number;
    waveDuration: number; 
    baseStagger: number;
    type: string;
    
    constructor(type: string) {
        const blockSize = 10; // 30 / 3
        this.type = type;
        this.baseHue = type === "line" ? 120
        : type === "square" ? 0
        : type === "z" ? 60
        : type === "l" ? 280
        : type === "s" ? 30   // S — оранжевый
        : type === "j" ? 200  // J — голубой
        : 40;
        this.cells = [];
        this.waveActive = false;
        this.waveStart = 0;
        this.waveDuration = 260;
        this.baseStagger = 22;
        this.pivot = {
            x: 150,
            y: 15
        };

        let idx = 0;
        const minX = 90;
        const maxX = 90 + 4 * blockSize * 3;

        if (type === "line") {
            // ---- Линия ----
            for (let i = 0; i < 4; i++) { 
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + i * blockSize * 3 + dx * blockSize;
                        const y = dy * blockSize;
                        const t = (x - minX) / (maxX - minX);
                        const lightness = 30 + t * 40; 
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({
                            x,
                            y,
                            shift: 15,
                            grounded: false,
                            row: null,
                            startX: x,
                            startY: y,
                            targetX: x,
                            targetY: y,
                            width: blockSize,
                            height: blockSize,
                            color,
                            lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger,
                            index: idx++
                        });
                    }
                }
            }

            this.pivot = {
                x: 150,
                y: 15
            };
        } else if (type === "square") {
            // ---- Квадрат (4 больших блока) ----
            const bigBlocksPerRow = 2; // 2 блока в ряд, 2 ряда = 4 блока всего
            for (let i = 0; i < 4; i++) {
                const row = Math.floor(i / bigBlocksPerRow);
                const col = i % bigBlocksPerRow;

                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + col * blockSize * 3 + dx * blockSize;
                        const y = row * blockSize * 3 + dy * blockSize;
                        const t = (x - minX) / (maxX - minX);
                        const lightness = 30 + t * 40;
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({ 
                            x, 
                            y, 
                            shift: 0,
                            grounded: false, 
                            row: null,
                            startX: x, 
                            startY: y, 
                            targetX: x, 
                            targetY: y,
                            width: blockSize, 
                            height: blockSize,
                            color, lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger, 
                            index: idx++
                        });
                    }
                }
            }

            this.pivot = {
                x: 60,
                y: 60
            };
        } else if (type === "z") {
            // ---- Фигура Z (4 больших блока) ----
            const blockSize = 10;
            let idx = 0;

            // сетка для Z: верхняя линия: 2 блока, нижняя: сдвинута вправо 2 блока
            const zOffsets = [
                { col: 0, row: 0 },
                { col: 1, row: 0 },
                { col: 1, row: 1 },
                { col: 2, row: 1 },
            ];

            for (let i = 0; i < zOffsets.length; i++) {
                const { col, row } = zOffsets[i];
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + col * blockSize * 3 + dx * blockSize;
                        const y = row * blockSize * 3 + dy * blockSize;
                        const lightness = 30 + ((x - minX) / (maxX - minX)) * 40;
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({
                            x, 
                            y, 
                            shift: 15, 
                            grounded: false, 
                            row: null,
                            startX: x, 
                            startY: y, 
                            targetX: x, 
                            targetY: y,
                            width: blockSize, 
                            height: blockSize,
                            color, lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger, 
                            index: idx++
                        });
                    }
                }
            }

            // динамический pivot для Z
            const minXCell = Math.min(...this.cells.map(c => c.targetX));
            const maxXCell = Math.max(...this.cells.map(c => c.targetX + c.width));
            const minYCell = Math.min(...this.cells.map(c => c.targetY));
            const maxYCell = Math.max(...this.cells.map(c => c.targetY + c.height));

            this.pivot = {
                x: (minXCell + maxXCell) / 2,
                y: (minYCell + maxYCell) / 2
            };
        } else if (type === "l") {
            // ---- Фигура L (4 больших блока) ----
            const blockSize = 10;
            let idx = 0;

            // смещения для L: вертикальная линия из 3 блоков + нижний блок вправо
            const lOffsets = [
                { col: 0, row: 0 },
                { col: 0, row: 1 },
                { col: 0, row: 2 },
                { col: 1, row: 2 },
            ];

            for (let i = 0; i < lOffsets.length; i++) {
                const { col, row } = lOffsets[i];
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + col * blockSize * 3 + dx * blockSize;
                        const y = row * blockSize * 3 + dy * blockSize;
                        const lightness = 30 + ((x - minX) / (maxX - minX)) * 40;
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({
                            x,
                            y,
                            shift: 15,
                            grounded: false,
                            row: null,
                            startX: x,
                            startY: y,
                            targetX: x,
                            targetY: y,
                            width: blockSize,
                            height: blockSize,
                            color,
                            lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger,
                            index: idx++
                        });
                    }
                }
            }

            // динамический pivot для L
            const minXCell = Math.min(...this.cells.map(c => c.targetX));
            const maxXCell = Math.max(...this.cells.map(c => c.targetX + c.width));
            const minYCell = Math.min(...this.cells.map(c => c.targetY));
            const maxYCell = Math.max(...this.cells.map(c => c.targetY + c.height));

            this.pivot = {
                x: (minXCell + maxXCell) / 2,
                y: (minYCell + maxYCell) / 2
            };
        } else if (type === "s") {
            // ---- Фигура S (обратная Z, 4 больших блока) ----
            const sOffsets = [
                { col: 1, row: 0 },
                { col: 2, row: 0 },
                { col: 0, row: 1 },
                { col: 1, row: 1 },
            ];

            let idx = 0;
            for (let i = 0; i < sOffsets.length; i++) {
                const { col, row } = sOffsets[i];
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + col * blockSize * 3 + dx * blockSize;
                        const y = row * blockSize * 3 + dy * blockSize;
                        const lightness = 30 + ((x - minX) / (maxX - minX)) * 40;
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({
                            x, y,
                            shift: 15,
                            grounded: false,
                            row: null,
                            startX: x, startY: y,
                            targetX: x, targetY: y,
                            width: blockSize, height: blockSize,
                            color,
                            lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger,
                            index: idx++
                        });
                    }
                }
            }

            const minXCell = Math.min(...this.cells.map(c => c.targetX));
            const maxXCell = Math.max(...this.cells.map(c => c.targetX + c.width));
            const minYCell = Math.min(...this.cells.map(c => c.targetY));
            const maxYCell = Math.max(...this.cells.map(c => c.targetY + c.height));

            this.pivot = {
                x: (minXCell + maxXCell) / 2,
                y: (minYCell + maxYCell) / 2
            };

        } else if (type === "j") {
            // ---- Фигура J (обратная L, 4 больших блока) ----
            const jOffsets = [
                { col: 1, row: 0 },
                { col: 1, row: 1 },
                { col: 1, row: 2 },
                { col: 0, row: 2 },
            ];

            let idx = 0;
            for (let i = 0; i < jOffsets.length; i++) {
                const { col, row } = jOffsets[i];
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        const x = 90 + col * blockSize * 3 + dx * blockSize;
                        const y = row * blockSize * 3 + dy * blockSize;
                        const lightness = 30 + ((x - minX) / (maxX - minX)) * 40;
                        const color = `hsl(${this.baseHue}, 80%, ${lightness}%)`;

                        this.cells.push({
                            x, y,
                            shift: 15,
                            grounded: false,
                            row: null,
                            startX: x, startY: y,
                            targetX: x, targetY: y,
                            width: blockSize, height: blockSize,
                            color,
                            lag: 0.18 + (dx + dy + i) * 0.01,
                            delay: idx * this.baseStagger,
                            index: idx++
                        });
                    }
                }
            }

            const minXCell = Math.min(...this.cells.map(c => c.targetX));
            const maxXCell = Math.max(...this.cells.map(c => c.targetX + c.width));
            const minYCell = Math.min(...this.cells.map(c => c.targetY));
            const maxYCell = Math.max(...this.cells.map(c => c.targetY + c.height));

            this.pivot = {
                x: (minXCell + maxXCell) / 2,
                y: (minYCell + maxYCell) / 2
            };
        }
    }
}
