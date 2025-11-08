import type { TetrominoCell } from "../../types";

export class GameStateComponent {
    grid: TetrominoCell[];
    raf: number | null;
    weight: number;
    velocity: number;
    timeStep: number;
    accumulated: number;
    current: number;
    soundOn: boolean;
    fallSmooth: number;
    score: number;
    lastBgAnimation: number;

    constructor() {
        this.grid = [];
        this.raf = null;
        this.weight = 1;
        this.velocity = 30;
        this.timeStep = 1000 / 60;
        this.accumulated = 0;
        this.current = 0;
        this.soundOn = true;
        this.fallSmooth = 0.18;
        this.score = 0;
        this.lastBgAnimation = 0;
    }
}