import type { ControllerState } from "../types";

export class Controller implements ControllerState {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    pause: boolean;
    start: boolean;
    gameOver: boolean;

    private pauseElement: HTMLDivElement | null = null;

    constructor(left: boolean, right: boolean, up: boolean, pause: boolean, down: boolean, start: boolean) {
        this.left = left;
        this.right = right;
        this.up = up;
        this.pause = pause;
        this.down = down;
        this.start = start;
        this.gameOver = false;
    }

    private showPauseOverlay() {
        if (!this.pauseElement) {
            this.pauseElement = document.createElement("div");
            this.pauseElement.innerText = "PAUSED";
            Object.assign(this.pauseElement.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "48px",
                color: "white",
                pointerEvents: "none",
                zIndex: "1000"
            });
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
                } else {
                    this.removePauseOverlay();
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
