import type { Entity } from "../entity";
import { 
    SpriteComponent, 
    PositionComponent, 
    ObstacleComponent, 
    SizeComponent, 
    ColorComponent, 
    BoundaryComponent, 
    ScaleComponent, 
    ExplosionComponent,
    ImageComponent,
    TypeComponent,
    GradientComponent
} from "../components";

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(entities: Entity[]) {
        for (const entity of entities) {
            const type = entity.getComponent<TypeComponent>("type");
            const gradient = entity.getComponent<GradientComponent>("gradient");
            const position = entity.getComponent<PositionComponent>("position");
            const color = entity.getComponent<ColorComponent>("color");
            const explosion = entity.getComponent<ExplosionComponent>("explosion");
            const sprite = entity.getComponent<SpriteComponent>("sprite");
            const obstacle = entity.getComponent<ObstacleComponent>("obstacle");
            const size = entity.getComponent<SizeComponent>("size");
            const boundary = entity.getComponent<BoundaryComponent>("boundary");
            const scale = entity.getComponent<ScaleComponent>("scale");
            const image = entity.getComponent<ImageComponent>("image");

            if (sprite && position && (type && (type.type === "bird" || type.type === "explosion"))) {
                if (explosion && !explosion.active) continue;
                const currentFrame = sprite.currentFrame;
                const frame = sprite.frames[currentFrame].frame;
                this.ctx.drawImage(
                    sprite.sprite,
                    frame.x,
                    frame.y,
                    frame.w,
                    frame.h,
                    position.x,
                    position.y,
                    frame.w * sprite.scale,
                    frame.h * sprite.scale
                );
                continue;
            }

            if (obstacle && size && color && boundary && position) {
                this.ctx.fillStyle = color.color;
                // верхняя часть
                this.ctx.fillRect(position.x, 0, size.width, obstacle.top);
                // нижняя часть
                this.ctx.fillRect(
                    position.x,
                    boundary.canvasHeight - obstacle.bottom,
                    size.width,
                    obstacle.bottom
                );
            }

            if (scale && color && position) {
                this.ctx.fillStyle = color.color;
                this.ctx.beginPath();
                this.ctx.arc(position.x, position.y, scale.scale, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            if (type && type.type === "moon") {
                if (image && position && size && boundary) {
                    this.ctx.drawImage(
                        image.img,
                        position.x,
                        position.y,
                        size.width,
                        size.height
                    );
                }
            }

            if (type && type.type === "image") {
                if (image && position && size && boundary) {
                    this.ctx.drawImage(image.img, position.x, position.y, boundary.canvasWidth, boundary.canvasHeight);
                    this.ctx.drawImage(image.img, position.x + boundary.canvasWidth, position.y, boundary.canvasWidth, boundary.canvasHeight);
                }
            }

            if (type && type.type === "gradient") {
                if (gradient && boundary) {
                    const g = this.ctx.createLinearGradient(0, 0, 0, boundary.canvasHeight);
                    for (let c of gradient.colors) g.addColorStop(c.stop, c.color);
                    this.ctx.fillStyle = g;
                    this.ctx.fillRect(0, 0, boundary.canvasWidth, boundary.canvasHeight);
                }
            }
        }
    }
}
