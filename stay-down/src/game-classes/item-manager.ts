import { Item } from "./item";
import { AnimatedSprite } from "./animated-sprite";

export class ItemManager {
    activeItems: Item[];
    sprites: AnimatedSprite[];

    constructor(activeItems: Item[], sprites: AnimatedSprite[]) {
        this.activeItems = activeItems;
        this.sprites = sprites;
    }

    createItem(x: number, y: number, color: string, index: number): void {
        const sprite = this.sprites[index];
        this.activeItems.push(new Item(x, y, 16, 16, color, sprite));
    }
}
