import { Particle } from "../objects/particle";
import { Bird } from "../objects/bird";

export class ParticleManager {
    particles: Particle[] = [];
    gameSpeed: number = 2;

    update(bird: Bird, color: string) {
        // Генерируем новую частицу возле птицы
        this.particles.unshift(new Particle(bird.x, bird.y, color, this.gameSpeed));

        // Обновляем все частицы
        for (let p of this.particles) {
            p.update();
        }

        // Ограничиваем количество частиц
        if (this.particles.length > 200) this.particles.length = 200;
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (let p of this.particles) {
            p.draw(ctx);
        }
    }

    setGameSpeed(speed: number) {
        this.gameSpeed = speed;
    }

    clear() {
        this.particles.length = 0;
    }
}
