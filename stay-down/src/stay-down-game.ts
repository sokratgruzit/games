import { 
    WORLD_HEIGHT, 
    WORLD_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y
} from "./constants";

import { Player } from "./game-classes/player";
import { Controller } from "./game-classes/controller";
import { GameEngine } from "./game-classes/engine";
import { GameState } from "./game-classes/game-state";
import { PlatformManager } from "./game-classes/platform-manager";
import { ItemManager } from "./game-classes/item-manager";
import { DetectCollisions } from "./game-classes/collisions";

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    controller: Controller;
    engine: GameEngine;
    state: GameState;
    platformManager: PlatformManager;
    collisions: DetectCollisions;
    itemManager: ItemManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: true })!;
        this.player = new Player(PLAYER_START_X, PLAYER_START_Y, PLAYER_WIDTH, PLAYER_HEIGHT, "red");
        this.controller = new Controller(false, false, false, false);
        this.engine = new GameEngine(() => this.update(), () => this.render());
        this.platformManager = new PlatformManager([]);
        this.itemManager = new ItemManager([]);
        this.collisions = new DetectCollisions();
        this.state = new GameState(this.controller, this.player, this.ctx, this.platformManager, this.collisions, this.itemManager);

        this.controller.activate();
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = WORLD_WIDTH;
        this.canvas.height = WORLD_HEIGHT;
    }

    update() {
        if (this.controller.pause) return;
        this.state.update();
    }

    render() {
        this.state.render();
    }

    start() {
        this.engine.start();
        this.state.createPlatforms();
    }

    stop() {
        this.engine.stop();
        this.controller.deactivate();
    }
}