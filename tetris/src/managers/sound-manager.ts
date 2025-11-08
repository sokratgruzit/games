import { EventBus } from "./event-bus";

export class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {};
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        // Загрузка звуков
        this.load("rotate", "sounds/impact.mp3");
        this.load("point", "sounds/coin.mp3");
        this.load("explosion", "sounds/explosion.mp3");
        this.load("gameover", "sounds/gameover.wav");
        this.load("gamestart", "sounds/gamestart.wav");

        this.eventBus.on("rotate", () => {
            this.play("rotate");
        });

        this.eventBus.on("point", () => {
            this.play("point");
        });

        this.eventBus.on("gameover", () => {
            this.play("gameover");
        });

        this.eventBus.on("gamestart", () => {
            this.play("gamestart");
        });

        this.eventBus.on("explosion", () => {
            this.play("explosion");
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
