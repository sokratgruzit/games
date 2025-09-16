export class PhysicsComponent {
    angle: number;
    weight: number;

    constructor(angle: number, weight: number = 1) {
        this.angle = angle;
        this.weight = weight;
    }
}