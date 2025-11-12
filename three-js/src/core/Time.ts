export class Time {
    private updateFn: ((dt: number) => void) | null = null;
    private renderFn: (() => void) | null = null;
    private raf: number | undefined;
    private timeStep: number = 1000 / 60;
    private accumulated: number = 0;
    private current: number = 0;
    private running: boolean = false;

    setUpdate(fn: (dt: number) => void) {
        this.updateFn = fn;
    }

    setRender(fn: () => void) {
        this.renderFn = fn;
    }

    private loop = (timeStamp: number) => {
        if (!this.running) return;

        const elapsed = timeStamp - this.current;
        this.accumulated += elapsed;
        this.current = timeStamp;

        if (this.accumulated > 1000) this.accumulated = this.timeStep;

        let updated = false;
        while (this.accumulated >= this.timeStep) {
            this.updateFn?.(this.timeStep);
            this.accumulated -= this.timeStep;
            updated = true;
        }

        if (updated) this.renderFn?.();
        this.raf = requestAnimationFrame(this.loop);
    };

    start() {
        if (this.running) return;
        this.running = true;
        this.current = performance.now();
        this.raf = requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
        if (this.raf) cancelAnimationFrame(this.raf);
    }
}
