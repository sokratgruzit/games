import Phaser from "phaser";

export class SoundManager {
    private scene: Phaser.Scene;

    private sounds: Record<string, Phaser.Sound.BaseSound> = {};
    private bgMusic?: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
        this.scene.load.audio("bgMusic", "assets/sounds/bg.mp3");
        this.scene.load.audio("hitBlock", "assets/sounds/hit.wav");
        this.scene.load.audio("hitPaddle", "assets/sounds/paddlehit.wav");
        this.scene.load.audio("restartBtn", "assets/sounds/gamestart.wav");
        this.scene.load.audio("gameOver", "assets/sounds/gameover.wav");
    }

    create() {
        this.bgMusic = this.scene.sound.add("bgMusic", { loop: true, volume: 0.5 });
        this.sounds["hitBlock"] = this.scene.sound.add("hitBlock");
        this.sounds["hitPaddle"] = this.scene.sound.add("hitPaddle");
        this.sounds["restartBtn"] = this.scene.sound.add("restartBtn");
        this.sounds["gameOver"] = this.scene.sound.add("gameOver");
    }

    playSound(key: keyof typeof this.sounds) {
        const sound = this.sounds[key];
        if (sound) sound.play();
    }

    playBG() {
        if (this.bgMusic) this.bgMusic.play();
    }

    stopBG() {
        if (this.bgMusic) this.bgMusic.stop();
    }

    setBGVolume(volume: number) {
        // проверяем, что bgMusic — WebAudioSound
        if (this.bgMusic instanceof Phaser.Sound.WebAudioSound) {
            this.bgMusic.setVolume(volume);
        }
    }
}
