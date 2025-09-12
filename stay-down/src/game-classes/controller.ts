import type { ControllerState } from "../types";

import { SoundManager } from "./sound-manager";

export class Controller implements ControllerState {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    pause: boolean;
    start: boolean;
    gameOver: boolean;
    soundManager: SoundManager;

    private pauseElement: HTMLDivElement | null = null;
    private pauseIcon: HTMLDivElement | null = null;
    private pauseIconInner: HTMLDivElement | null = null;

    constructor(left: boolean, right: boolean, up: boolean, pause: boolean, down: boolean, start: boolean, soundManager: SoundManager) {
        this.left = left;
        this.right = right;
        this.up = up;
        this.pause = pause;
        this.down = down;
        this.start = start;
        this.gameOver = false;
        this.soundManager = soundManager;
    }

    private showPauseOverlay() {
        if (!this.pauseElement) {
            this.pauseElement = document.createElement("div");
            this.pauseIcon = document.createElement("div");
            this.pauseIconInner = document.createElement("div");
            this.pauseElement.setAttribute("class", "pause-layout");
            this.pauseIcon.setAttribute("class", "pause-icon");
            this.pauseIconInner.setAttribute("class", "pause-icon-inner");

            this.pauseIcon.appendChild(this.pauseIconInner );
            this.pauseElement.appendChild(this.pauseIcon);
            document.body.appendChild(this.pauseElement);
        }
    }

    private removePauseOverlay() {
        if (this.pauseElement) {
            this.pauseElement.remove();
            this.pauseElement = null;
        }
    }

    keyDown = (event: KeyboardEvent) => {
        switch(event.key) {
            case "ArrowLeft": this.left = true; break;
            case "ArrowRight": this.right = true; break;
            case "ArrowUp": this.up = true; break;
            case "ArrowDown": this.down = true; break;
            case "Enter": 
                if (this.gameOver) this.start = true;
                break;
            case " ":
                if (!this.gameOver) this.pause = !this.pause;
                
                if (this.pause) {
                    this.showPauseOverlay();
                    this.soundManager.pauseBg();
                } else {
                    this.removePauseOverlay();
                    this.soundManager.resumeBg();
                }

                break;
        }
    }

    getGameOver = (over: boolean) => {
        this.gameOver = over;
    }

    keyUp = (event: KeyboardEvent) => {
        switch(event.key) {
            case "ArrowLeft": this.left = false; break;
            case "ArrowRight": this.right = false; break;
            case "ArrowUp": this.up = false; break;
            case "ArrowDown": this.down = false; break;
        }
    }

    activate() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    deactivate() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
    }
}
