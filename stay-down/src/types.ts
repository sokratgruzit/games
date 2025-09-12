export interface Rectangle2DState {
    x: number;
    y: number;
    width: number;
    height: number;
    old_y: number;
}

export interface ControllerState {
    left: boolean;
    right: boolean;
    up: boolean;
    pause: boolean;
    down: boolean;
}

export interface Flash {
    text: string;
    x: number;
    y: number;
    timer: number;
}

export interface FlyingFlash {
    text: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    timer: number;
    points: number;
    merged: boolean;
    scale: number;
    color: string;
    alpha: number;
}

export interface Frame {
    image: HTMLCanvasElement;
    width: number;
    height: number;
}