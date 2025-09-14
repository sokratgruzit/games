import { EventBus } from "./event-bus";

export class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {};
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        // Загрузка звуков
        this.load("explosion", "assets/sounds/explosion.mp3");
        this.load("point", "assets/sounds/coin.mp3");
        this.load("gamestart", "assets/sounds/gamestart.wav");
        this.load("gameover", "assets/sounds/gameover.wav");
        this.load("particles", "assets/sounds/particles.mp3");
        this.load("wings", "assets/sounds/wings.mp3");

        // Подписка на события
        this.eventBus.on("birdCollision", () => {
            this.play("explosion");
            this.stop("particles");
            this.play("gameover");
        });

        this.eventBus.on("birdFlap", () => {
            this.play("wings");
        });

        this.eventBus.on("scoreIncrease", () => {
            this.play("point");
        });

        this.eventBus.on("gameStart", () => {
            this.play("gamestart");
            this.play("particles", true);
        });

        this.eventBus.on("gameOver", () => {
            this.stop("particles");
        });
    }

    private load(name: string, src: string) {
        const audio = new Audio(src);
        audio.preload = "auto";
        this.sounds[name] = audio;
    }

    play(name: string, loop = false) {
        const s = this.sounds[name];
        if (!s) return;
        s.currentTime = 0;
        s.loop = loop;
        s.play().catch(() => {});
    }

    stop(name: string) {
        const s = this.sounds[name];
        if (!s) return;
        s.pause();
        s.currentTime = 0;
    }
}
