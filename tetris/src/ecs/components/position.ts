export class PositionComponent {
    x: number;
    y: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    shift: number;
    grounded: boolean;
    lag: number;

    constructor(
        x: number, 
        y: number,
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        shift: number,
        grounded: boolean,
        lag: number
    ) {
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.shift = shift;
        this.grounded = grounded;
        this.lag = lag;
    }
}