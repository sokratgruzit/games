import type { Entity } from "../entity";
import { 
    SpriteComponent, 
    PositionComponent, 
    ObstacleComponent, 
    SizeComponent, 
    ColorComponent, 
    BoundaryComponent, 
    ScaleComponent, 
    ExplosionComponent 
} from "../components";

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(entities: Entity[]) {
        for (const entity of entities) {
            const position = entity.getComponent<PositionComponent>("position");
            const color = entity.getComponent<ColorComponent>("color");
            const explosion = entity.getComponent<ExplosionComponent>("explosion");

            if (!position) continue;

            // Спрайт
            const sprite = entity.getComponent<SpriteComponent>("sprite");
            if (sprite) {
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

            // Препятствие
            const obstacle = entity.getComponent<ObstacleComponent>("obstacle");
            const size = entity.getComponent<SizeComponent>("size");
            const boundary = entity.getComponent<BoundaryComponent>("boundary");
            
            if (obstacle && size && color && boundary) {
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

            // Particles
            const scale = entity.getComponent<ScaleComponent>("scale");

            if (scale && color) {
                this.ctx.fillStyle = color.color;
                this.ctx.beginPath();
                this.ctx.arc(position.x, position.y, scale.scale, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
}
