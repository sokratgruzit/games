import {
    GRAVITY,
    FRICTION,
    WORLD_HEIGHT,
    WORLD_WIDTH,
    GROUND
} from "../constants";

import { Player } from "./player";
import { Controller } from "./controller";
import { PlatformManager } from "./platform-manager";
import { DetectCollisions } from "./collisions";
import { ItemManager } from "./item-manager";

export class GameState {
    player: Player;
    controller: Controller;
    ctx: CanvasRenderingContext2D;
    platformManager: PlatformManager;
    collisions: DetectCollisions;
    itemManager: ItemManager;

    constructor(controller: Controller, player: Player, ctx: CanvasRenderingContext2D, platformManager: PlatformManager, collisions: DetectCollisions, itemManager: ItemManager) {
        this.player = player;
        this.controller = controller;
        this.ctx = ctx;
        this.platformManager = platformManager;
        this.collisions = collisions;
        this.itemManager = itemManager;
    }

    update() {
        if (this.controller.left) this.player.moveLeft();
        if (this.controller.right) this.player.moveRight();
        if (this.controller.up) this.player.jump();

        this.player.updatePosition(GRAVITY, FRICTION);

        if (this.collisions.groundCollision(this.player, GROUND.top)) {
            this.player.setBottom(GROUND.top);
            this.player.ground();
        }

        let platforms = this.platformManager.activePlatforms;

        for (let index = platforms.length - 1; index > -1; --index) {
            let platform = platforms[index];

            if (this.collisions.platformCollision(this.player, platform)) {
                this.player.setBottom(platform.getTop());
                this.player.ground();
            }

            platform.moveUp();

            if (platform.y < 32) {
                platform.y = WORLD_HEIGHT;
                platform.move_force = Math.random() * 1 + 1;
            }
        }
    }

    render() {
        this.ctx.fillStyle = "#303840";
        this.ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, GROUND.top, WORLD_WIDTH, 4);

        let platforms = this.platformManager.activePlatforms;
        this.ctx.fillStyle = "#0090f0";

        for (let index = platforms.length - 1; index > -1; --index) {
            let platform = platforms[index];

            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }   

    createPlatforms() {
        for (let x = WORLD_WIDTH - 50; x > 0; x -= 50) {
            this.platformManager.createPlatform(x, GROUND.top);
        }
    }
}