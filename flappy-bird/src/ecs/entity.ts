export class Entity {
    id: number;
    components: Map<string, any>;

    constructor(id: number) {
        this.id = id;
        this.components = new Map();
    }

    addComponent(name: string, component: any) {
        this.components.set(name, component);
        return this;
    }

    getComponent<T>(name: string): T | undefined {
        return this.components.get(name);
    }

    hasComponent(name: string) {
        return this.components.has(name);
    }
}