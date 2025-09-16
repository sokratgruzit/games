export class GameStateComponent {
    paused: boolean = false;
    gameOver: boolean = false;
    score: number = 0;
    currentExplosionIndex: number = 0;
    hue: number = 0;
    frame: number = 0;
    particlePlaying: boolean = true;
}