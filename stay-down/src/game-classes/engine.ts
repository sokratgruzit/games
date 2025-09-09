export class GameEngine {
    update!: () => void;
    render!: () => void;
    raf: number | undefined;
    timeStep: number;
    accumulated: number;
    current: number;
    elapsed: number;
    running: boolean;

    constructor(update: () => void, render: () => void) {
        this.update = update;
        this.render = render;
        this.timeStep = 1000 / 60;
        this.accumulated = 0;
        this.current = 0;
        this.elapsed = 0;
        this.running = false;
        this.raf = undefined;
    }

    private loop = (timeStamp: number): void => {
        let updated = false;

        this.elapsed = timeStamp - this.current;
        this.accumulated += this.elapsed;
        this.current = timeStamp;

        if (this.accumulated > 60) this.accumulated = this.timeStep;

        while(this.accumulated >= this.timeStep) {
            this.update();
            updated = true;
            this.accumulated -= this.timeStep;
        }

        if (updated) this.render();
        this.raf = window.requestAnimationFrame(this.loop);
    };

    start() {
        this.running = true;
        this.raf = window.requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
        if (this.raf) window.cancelAnimationFrame(this.raf);
    }

    setUp(update: () => void, render: () => void) {
        this.update = update;
        this.render = render;
    }
}