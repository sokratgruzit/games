import { Player } from "./player";
import { Platform } from "./platform";
import { Item } from "./item";

export class DetectCollisions {
    groundCollision(player: Player, top: number): boolean {
        return player.getBottom() >= top;
    }

    platformCollision(player: Player, platform: Platform): boolean {
        const xOverlap = player.getRight() > platform.getLeft() && player.getLeft() < platform.getRight();
        const yOverlap = player.getBottom() > platform.getTop() && player.getOldBottom() <= platform.getOldTop();

        return xOverlap && yOverlap;
    }

    itemCollision(player: Player, item: Item): boolean {
        const xOverlap = player.getRight() > item.getLeft() && player.getLeft() < item.getRight();
        const yOverlap = player.getBottom() > item.getTop() && player.getTop() < item.getBottom();

        return xOverlap && yOverlap;
    }
}