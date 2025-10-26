import type { TetrominoCell, Pivot } from "../../types";

export class TetrominoComponent {
    cells: TetrominoCell[];
    pivot: Pivot;
    baseHue: number;
    waveActive: boolean;
    waveStart: number;
    waveDuration: number; 
    baseStagger: number;
    
    constructor() {
        const blockSize = 10; // 30 / 3
        this.baseHue = Math.floor(Math.random() * 360);
        this.cells = [];
        this.waveActive = false;
        this.waveStart = 0;
        this.waveDuration = 260;
        this.baseStagger = 22;

        let idx = 0;

        for (let i = 0; i < 4; i++) {        // 4 больших блока линии
            for (let dx = 0; dx < 3; dx++) {
                for (let dy = 0; dy < 3; dy++) {
                    const x = 90 + i * blockSize * 3 + dx * blockSize;
                    const y = dy * blockSize;

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
                        color: "blue",
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
    }
}