import type { ControllerState } from "../types";

export class Controller implements ControllerState {
    left: boolean;
    right: boolean;
    up: boolean;
    pause: boolean;

    constructor(left: boolean, right: boolean, up: boolean, pause: boolean) {
        this.left = left;
        this.right = right;
        this.up = up;
        this.pause = pause;
    }

    keyDown = (event: KeyboardEvent) => {
        switch(event.key) {
            case "ArrowLeft": this.left = true; break;
            case "ArrowRight": this.right = true; break;
            case "ArrowUp": this.up = true; break;
            case " ":
                this.pause = !this.pause;
                break;
        }
    }

    keyUp = (event: KeyboardEvent) => {
        switch(event.key) {
            case "ArrowLeft": this.left = false; break;
            case "ArrowRight": this.right = false; break;
            case "ArrowUp": this.up = false; break;
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
