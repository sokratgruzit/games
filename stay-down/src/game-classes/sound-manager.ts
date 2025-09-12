export class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {};

    constructor() {
        this.load("jump", "assets/sounds/jump.mp3");
        this.load("coin", "assets/sounds/coin.mp3");
        this.load("gameover", "assets/sounds/game-over.mp3");
        this.load("slide", "assets/sounds/slide-in.mp3");
        this.load("bg", "assets/sounds/background-music.mp3");

        // фоновая музыка сразу включается
        const bg = this.sounds["bg"];
        if (bg) {
            bg.loop = true;
            bg.volume = 0.4; // чтоб не глушила эффекты
            bg.play().catch(() => {});
        }
    }

    private load(name: string, src: string) {
        const audio = new Audio(src);
        audio.preload = "auto";
        this.sounds[name] = audio;
    }

    play(name: string) {
        const s = this.sounds[name];
        if (!s) return;
        s.currentTime = 0;
        s.play().catch(() => {});
    }

    pauseBg() {
        const bg = this.sounds["bg"];
        if (bg) bg.pause();
    }

    resumeBg() {
        const bg = this.sounds["bg"];
        if (bg && bg.paused) bg.play().catch(() => {});
    }
}
