export class Background {
    ctx: CanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;

    skyImage: HTMLImageElement;
    mountainsImage: HTMLImageElement;

    skyY: number;
    mountainsY: number;

    maxSkyOffset: number;
    maxMountainsOffset: number;

    mountainHeight: number;

    initialPlayerY: number;

    constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.skyImage = new Image();
        this.skyImage.src = "assets/sky-stay-down.png";
        this.mountainsImage = new Image();
        this.mountainsImage.src = "assets/mountains-stay-down.png";

        this.mountainHeight = canvasHeight * 0.5;
        this.mountainsY = canvasHeight - this.mountainHeight * 0.5; // горы выглядывают из земли

        this.skyY = 0;
        this.maxSkyOffset = 50;
        this.maxMountainsOffset = 100;

        this.initialPlayerY = 0; // будет задан при старте игры
    }

    // задаём стартовую позицию игрока
    setInitialPlayerY(y: number) {
        this.initialPlayerY = y;
    }

    update(playerY: number) {
        // расчёт смещения относительно стартовой позиции
        const deltaY = playerY - this.initialPlayerY;

        // облака двигаются медленнее
        let newSkyY = -deltaY * 0.05;
        newSkyY = Math.max(-this.maxSkyOffset, Math.min(0, newSkyY));
        this.skyY = newSkyY;

        // горы движутся чуть быстрее
        let newMountainsY = this.canvasHeight - this.mountainHeight * 0.5 - deltaY * 0.15;
        const minMountainsY = this.canvasHeight - this.mountainHeight - this.maxMountainsOffset;
        newMountainsY = Math.max(minMountainsY, Math.min(this.canvasHeight - this.mountainHeight * 0.5, newMountainsY));
        this.mountainsY = newMountainsY;
    }

    render() {
        // облака
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(this.skyImage, 0, this.skyY, this.canvasWidth, this.canvasHeight * 0.9);

        // горы
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.mountainsImage, 0, this.mountainsY, this.canvasWidth, this.mountainHeight);

        this.ctx.globalAlpha = 1;
    }
}
