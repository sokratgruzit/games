import { Blade } from "./blade";

export class BladesManager {
    activeBlades: Blade[];

    constructor(activeBlades: Blade[]) {
        this.activeBlades = activeBlades;
    }

    createBlade(x: number, y: number, color: string): void {
        this.activeBlades.push(new Blade(x, y, 48, 48, color));
    }
}
