export interface FrameData {
    frame: { x: number; y: number; w: number; h: number };
}

export interface SpriteJSON {
    frames: Record<string, FrameData>;
    meta: { image: string };
}

export type EventHandler = (...args: any[]) => void;