export class GameEngine {
    private update: (dt: number) => void;
    private render: () => void;
    private raf: number | undefined;
    private timeStep: number;
    private accumulated: number;
    private current: number;
    private running: boolean;

    constructor(update: (dt: number) => void, render: () => void) {
        this.update = update;
        this.render = render;
        this.timeStep = 1000 / 60; // фиксированный шаг
        this.accumulated = 0;
        this.current = 0;
        this.running = false;
        this.raf = undefined;
    }

    private loop = (timeStamp: number): void => {
        let updated = false;
        const elapsed = timeStamp - this.current;
        this.accumulated += elapsed;
        this.current = timeStamp;

        if (this.accumulated > 1000) this.accumulated = this.timeStep;

        while (this.accumulated >= this.timeStep) {
            this.update(this.timeStep);
            this.accumulated -= this.timeStep;
            updated = true;
        }

        if (updated) this.render();
        this.raf = window.requestAnimationFrame(this.loop);
    };

    start() {
        if (this.running) return;
        this.running = true;
        this.current = performance.now();
        this.raf = window.requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
        if (this.raf) window.cancelAnimationFrame(this.raf);
    }

    setUp(update: (dt: number) => void, render: () => void) {
        this.update = update;
        this.render = render;
    }
}
