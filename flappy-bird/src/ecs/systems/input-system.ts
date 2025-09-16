import { InputComponent } from "../components";
import { InputManager } from "../../managers/input-manager";

export class InputSystem {
    private inputManager: InputManager;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    update(input: InputComponent, role: "bird" | "game") {
        if (role === "bird") {
            input.keys["Space"] = this.inputManager.isPressed("Space");
        }

        if (role === "game") {
            input.keys["KeyP"] = this.inputManager.wasJustPressed("KeyP");
            input.keys["KeyR"] = this.inputManager.wasJustPressed("KeyR");
        }
    }
}
