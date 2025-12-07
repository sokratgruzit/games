import {
    Color,
    Mesh,
    MeshBasicMaterial,
    SphereGeometry,
    Vector3,
    Group
} from 'three';
import { Orbit } from './Orbit';

export class CometTail {
    public orbit: Orbit;
    public speed: number = 0.3;
    public head: Mesh;
    public tail: Mesh[] = [];
    public radius: number = 10;
    private tailPositions: Vector3[] = [];
    public points: Group;
    private angle = 0;
    public tailCount = 20;
    public colorStart = new Color(0xffffff); // белый
    public colorEnd = new Color(0xff8000);   // оранжевый
    public name: string = "";
    public belongsTo: string = "";
    public type: string = "";

    constructor(belongsTo: string, name: string, orbit: Orbit, type: string) {
        this.orbit = orbit;
        this.points = new Group();
        this.belongsTo = belongsTo;
        this.name = name;
        this.type = type;

        // создаём геометрию
        this.head = this.createHead();
        this.createTail();
    }

    private createHead(): Mesh {
        const geom = new SphereGeometry(this.radius, 16, 16);
        const mat = new MeshBasicMaterial({ color: this.colorStart });
        const mesh = new Mesh(geom, mat);
        this.points.add(mesh);
        return mesh;
    }

    private createTail() {
        this.tail = [];
        this.tailPositions = [];

        for (let i = 0; i < this.tailCount; i++) {
            const size = this.radius * (1 - i / this.tailCount);
            const alpha = 1 - i / this.tailCount;
            const geom = new SphereGeometry(size, 12, 12);
            const mat = new MeshBasicMaterial({
                color: this.getTailColor(i),
                transparent: true,
                opacity: alpha
            });
            const mesh = new Mesh(geom, mat);
            this.tail.push(mesh);
            this.tailPositions.push(new Vector3());
            this.points.add(mesh);
        }
    }

    private getTailColor(index: number): Color {
        const t = index / (this.tailCount - 1);
        return new Color(
            this.colorStart.r + t * (this.colorEnd.r - this.colorStart.r),
            this.colorStart.g + t * (this.colorEnd.g - this.colorStart.g),
            this.colorStart.b + t * (this.colorEnd.b - this.colorStart.b)
        );
    }

    /** Изменение количества хвостовых сегментов */
    setTailCount(count: number) {
        this.tailCount = count;
        this.rebuildTail();
    }

    setStartColor(color: string) {
        this.colorStart = new Color(color);
        if (this.head) (this.head.material as MeshBasicMaterial).color.copy(this.colorStart);
        this.rebuildTail();
    }

    setEndColor(color: string) {
        this.colorEnd = new Color(color);
        this.rebuildTail();
    }

    /** Изменение радиуса головы */
    setRadius(radius: number) {
        this.radius = radius;

        // обновляем голову
        (this.head.geometry as SphereGeometry).dispose();
        this.head.geometry = new SphereGeometry(this.radius, 16, 16);

        this.rebuildTail();
    }

    /** Изменение скорости движения */
    setSpeed(speed: number) {
        this.speed = speed;
    }

    /** Изменение градиента хвоста и головы */
    setColors(start: Color, end: Color) {
        this.colorStart.copy(start);
        this.colorEnd.copy(end);

        (this.head.material as MeshBasicMaterial).color.copy(this.colorStart);

        for (let i = 0; i < this.tail.length; i++) {
            (this.tail[i].material as MeshBasicMaterial).color.copy(this.getTailColor(i));
        }
    }

    /** Перестраиваем хвост после изменения размера или количества сегментов */
    private rebuildTail() {
        // удаляем старый хвост
        this.tail.forEach(mesh => {
            mesh.geometry.dispose();
            (mesh.material as MeshBasicMaterial).dispose();
            this.points.remove(mesh);
        });

        // создаём заново
        this.createTail();
    }

    /** Обновление позиции головы и хвоста */
    update(delta: number) {
        this.angle += delta * this.speed * 0.001;

        const x = Math.cos(this.angle) * this.orbit.radiusX;
        const z = Math.sin(this.angle) * this.orbit.radiusZ;
        const headPos = new Vector3(x, 0, z).applyEuler(this.orbit.rotationEuler);

        this.head.position.copy(headPos);

        let prevPos = headPos.clone();
        for (let i = 0; i < this.tail.length; i++) {
            const tailPos = this.tailPositions[i];
            tailPos.lerp(prevPos, 0.2);
            this.tail[i].position.copy(tailPos);
            prevPos.copy(tailPos);
        }
    }

    /** Очистка памяти */
    dispose() {
        if (this.head) {
            this.head.geometry.dispose();
            (this.head.material as MeshBasicMaterial).dispose();
        }

        this.tail.forEach(mesh => {
            mesh.geometry.dispose();
            (mesh.material as MeshBasicMaterial).dispose();
        });

        this.tail = [];
        this.tailPositions = [];
        this.points.clear();
    }
}
