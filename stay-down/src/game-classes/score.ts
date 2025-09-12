import type { FlyingFlash } from "../types";

export class Score {
    value: number;
    flashes: FlyingFlash[];
    counterX: number;
    counterY: number;

    constructor() {
        this.value = 0;
        this.flashes = [];
        this.counterX = 80;
        this.counterY = 40;
    }

    add(points: number, x?: number, y?: number) {
        if (x !== undefined && y !== undefined) {
            this.flashes.push({
                text: `+${points}`,
                x,
                y,
                startX: x,
                startY: y,
                targetX: this.counterX + 10,
                targetY: this.counterY - 8,
                timer: 30,
                points,
                merged: false,
                scale: 2,
                color: "yellow",
                alpha: 1
            });
        }
    }

    update() {
        for (const f of this.flashes) {
            if (!f.merged) {
                const dx = (f.targetX - f.x) * 0.2;
                const dy = (f.targetY - f.y) * 0.2;
                f.x += dx;
                f.y += dy;

                f.scale = 1 + 0.5 * Math.hypot(f.targetX - f.x, f.targetY - f.y) / 100;

                // прозрачность уменьшается по мере приближения
                const dist = Math.hypot(f.targetX - f.x, f.targetY - f.y);
                f.alpha = Math.min(1, dist / 100);

                if (Math.abs(f.x - f.targetX) < 2 && Math.abs(f.y - f.targetY) < 2) {
                    f.merged = true;
                    f.timer = 15;
                    f.x = f.targetX;
                    f.y = f.targetY;
                    f.scale = 1;
                    f.color = "white";
                    f.alpha = 1;
                }
            } else {
                f.timer--;
                f.alpha = f.timer / 15; // плавное исчезание после слияния
            }
        }

        const finished = this.flashes.filter(f => f.merged && f.timer <= 0);
        finished.forEach(f => this.value += f.points);

        this.flashes = this.flashes.filter(f => !f.merged || f.timer > 0);
    }

    render(ctx: CanvasRenderingContext2D) {
        // Статичная надпись
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText("Score:", this.counterX - 60, this.counterY - 10);

        // Основной счёт рядом
        ctx.fillStyle = "#fff";
        ctx.font = "22px Arial";
        ctx.fillText(`${this.value}`, this.counterX + 10, this.counterY - 8);

        // Анимация полёта
        for (const f of this.flashes) {
            ctx.fillStyle = `rgba(255,255,0,${f.alpha})`;
            ctx.font = `${22 * f.scale}px Arial`;
            ctx.fillText(f.text, f.x, f.y);
        }
    }
}
