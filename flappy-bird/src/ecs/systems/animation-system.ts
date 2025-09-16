import { SpriteComponent, BirdComponent, InputComponent } from "../components";

export class AnimationSystem {
    update(sprite: SpriteComponent, bird: BirdComponent, input: InputComponent) {
        if (input.keys["Space"]) {
            bird.flapTimer++;
            if (bird.flapTimer % 3 === 0) {
                sprite.currentFrame = (sprite.currentFrame + 1) % sprite.frames.length;
            }
        } else if (!input.keys["Space"]) {
            if (bird.defaultFlyTimer % 15 === 0) {
                sprite.currentFrame = (sprite.currentFrame + 1) % sprite.frames.length;
            }
        }
    }
}
