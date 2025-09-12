import type { Rectangle2DState } from "../types";

export class Rectangle2D implements Rectangle2DState {
    old_y: number;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.old_y = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getBottom(): number {
        return this.y + this.height;
    }

    getTop(): number {
        return this.y;
    }

    getOldBottom(): number {
        return this.old_y + this.height;
    }

    getOldTop(): number {
        return this.old_y;
    }

    getLeft(): number {
        return this.x;
    }

    getRight(): number {
        return this.x + this.width;
    }

    setBottom(y: number): void {
        this.y = y - this.height;
    }

    setTop(y: number): void {
        this.y = y;
    }

    setLeft(x: number): void {
        this.x = x;
    }

    setRight(x: number): void {
        this.x = x - this.width;
    }

    moveX(x: number): void {
        this.x += x;
    }

    moveY(dy: number): void {
        this.old_y = this.y; 
        this.y += dy;
    }

    getCenterX() {
        return this.x + this.width * 0.5;
    }

    getCenterY() {
        return this.y + this.height * 0.5;
    }
}