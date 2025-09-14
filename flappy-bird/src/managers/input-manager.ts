export class InputManager {
    private keysPressed: Record<string, boolean> = {};
    private keysJustPressed: Record<string, boolean> = {};

    constructor() {
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.keysPressed[e.code]) {
            this.keysJustPressed[e.code] = true; // одноразовый флаг
        }
        this.keysPressed[e.code] = true;
    }

    private onKeyUp(e: KeyboardEvent) {
        this.keysPressed[e.code] = false;
        this.keysJustPressed[e.code] = false;
    }

    isPressed(code: string): boolean {
        return !!this.keysPressed[code];
    }

    wasJustPressed(code: string): boolean {
        if (this.keysJustPressed[code]) {
            this.keysJustPressed[code] = false; // сброс флага после чтения
            return true;
        }
        return false;
    }
}
