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
}