import type { Entity } from "../entity";
import { EventBus } from "../../managers/event-bus";
import { 
    PositionComponent, 
    VelocityComponent, 
    BirdComponent, 
    InputComponent, 
    SizeComponent, 
    ObstacleComponent,
    BoundaryComponent,
    PhysicsComponent,
    SpriteComponent,
    ScaleComponent,
    ExplosionComponent,
    ImageComponent,
    TypeComponent
} from "../components";

export class PhysicsSystem {
    update(entities: Entity[], eventBus: EventBus, _delta: number) {
        for (const entity of entities) {
            const type = entity.getComponent<TypeComponent>("type");
            const position = entity.getComponent<PositionComponent>("position");
            const velocity = entity.getComponent<VelocityComponent>("velocity");
            const explosion = entity.getComponent<ExplosionComponent>("explosion");
            const sprite = entity.getComponent<SpriteComponent>("sprite");
            const boundary = entity.getComponent<BoundaryComponent>("boundary");
            const physics = entity.getComponent<PhysicsComponent>("physics");
            const bird = entity.getComponent<BirdComponent>("bird");
            const input = entity.getComponent<InputComponent>("input");
            const size = entity.getComponent<SizeComponent>("size");
            const obstacle = entity.getComponent<ObstacleComponent>("obstacle");
            const scale = entity.getComponent<ScaleComponent>("scale");
            const image = entity.getComponent<ImageComponent>("image");

            if (explosion && type && type.type === "explosion") {
                if (!explosion.active) continue;

                if (explosion.active) {
                    if (!sprite || !position) continue; 

                    explosion.frameTimer++;

                    if (explosion.frameTimer >= explosion.frameDelay) {
                        explosion.frameTimer = 0;
                        sprite.currentFrame++;
                        if (sprite.currentFrame >= sprite.frames.length) {
                            explosion.active = false;
                            eventBus.emit("explosionFinished");
                        }
                    }
                }
            }

            if (!position || !velocity) continue;
            
            if (type && type.type === "bird") {
                if (bird && input && size && boundary && physics && sprite) {
                    const amplitude = 15;
                    const lowerBound = boundary.canvasHeight - size.height - amplitude * 2;
                    const upperBound = boundary.canvasHeight;
                    
                    if (input.keys["Space"]) {
                        velocity.vy -= 2;
                        position.y += velocity.vy;
                        velocity.vy *= 0.9;
                    } else if (position.y >= lowerBound && position.y <= upperBound) {
                        bird.defaultFlyTimer++;
                        const baseY = lowerBound + amplitude;
                        position.y = baseY + Math.sin(bird.defaultFlyTimer * 0.05) * amplitude;
                    } else {
                        velocity.vy += physics.weight;
                        position.y += velocity.vy;
                        sprite.currentFrame = 0;
                        bird.flapTimer = 0;
                        velocity.vy *= 0.9;
                    }
    
                    if (position.y < 0) position.y = 0;
                    if (position.y + size.height > boundary.canvasHeight) position.y = boundary.canvasHeight - size.height;
    
                    continue; // птица обработана
                }
            }

            if (type && type.type === "obstacle") {
                if (obstacle && size) {
                    position.x -= velocity.vx; 
    
                    if (!obstacle.counted && eventBus && position.x + size.width < 150) { 
                        eventBus.emit("scoreIncrease");
                        obstacle.counted = true;
                    }
    
                    continue;
                }
            }
            
            if (type && type.type === "particle") {
                if (scale) {
                    position.x -= velocity.vx;
                    position.y += velocity.vy;
                }
            }

            if (type && type.type === "moon") {
                if (image && position && velocity && size && boundary) {
                    position.x -= 2 * velocity.vx;
    
                    if (position.x + size.width <= 0) {
                        position.x = boundary.canvasWidth;
                    }
                }
            }

            if (type && type.type === "image") {
                if (image && position && velocity && size && boundary) {
                    position.x -= 2 * velocity.vx;

                    if (position.x <= -boundary.canvasWidth) {
                        position.x = 0;
                    }
                }
            }
        }
    }
}
