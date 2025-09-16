export class ObstacleComponent {
    top: number;
    bottom: number;
    counted: boolean;

    constructor(top: number, bottom: number) {
        this.top = top;
        this.bottom = bottom;
        this.counted = false;
    }
}