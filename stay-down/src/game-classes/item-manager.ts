import { Item } from "./item"

export class ItemManager {
    activeItems: Item[];

    constructor(activeItems: Item[]) {
        this.activeItems = activeItems;
    }

    createItem(x: number, y: number, color: string): void {
        this.activeItems.push(new Item(x, y, 16, 16, color));
    }
}