export interface Star extends Phaser.GameObjects.Graphics {
    xPos: number;
    yPos: number;
    size: number;
    baseAlpha: number;
    speed: number;
}

export interface FallingStar extends Phaser.GameObjects.Graphics {
    xPos: number;
    yPos: number;
    vx: number;
    vy: number;
    trail: { x: number; y: number; alpha: number }[];
}

export type BlockType = "green" | "yellow" | "pink" | "purple" | "red";

export interface LevelConfig {
    rows: number;
    columns: number;
    pattern: (row: number, col: number) => BlockType;
}