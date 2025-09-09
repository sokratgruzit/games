import { Player } from "./player";
import { Platform } from "./platform";

export class DetectCollisions {
    groundCollision(player: Player, top: number): boolean {
        const bottom = player.getBottom();

        if (bottom >= top) {
            return true;
        }

        return false;
    }

    platformCollision(player: Player, platform: Platform): boolean {
        if (
            player.getRight() < platform.getLeft() || 
            player.getLeft() > platform.getRight() || 
            player.getBottom() <= platform.getTop() ||
            player.getOldBottom() > platform.getOldTop()
        ) {
            return false;
        }

        return true;
    }
}