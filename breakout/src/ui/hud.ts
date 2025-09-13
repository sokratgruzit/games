import Phaser from "phaser";

export class HUD {
    scoreText: Phaser.GameObjects.Text;
    livesText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, score: number, lives: number, level: number) {
        this.scoreText = scene.add.text(40, 16, `Score: ${score}`, { fontSize: "24px", color: "#fff" });
        this.livesText = scene.add.text(635, 16, `Lives: ${lives}`, { fontSize: "24px", color: "#AEEB9B" });
        this.levelText = scene.add.text(340, 16, `Level: ${level}`, { fontSize: "24px", color: "#fff" });
    }

    updateScore(score: number) { this.scoreText.setText(`Score: ${score}`); }
    updateLives(lives: number) {
        let color = "#AEEB9B";
        if (lives === 2) color = "#FFFE91";
        if (lives === 1) color = "#EB3005";
        this.livesText.setColor(color);
        this.livesText.setText(`Lives: ${lives}`);
    }
    updateLevel(level: number) { this.levelText.setText(`Level: ${level}`); }
}
