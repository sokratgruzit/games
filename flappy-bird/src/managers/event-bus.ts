type EventHandler = (...args: any[]) => void;

export class EventBus {
    private listeners: Record<string, EventHandler[]> = {};

    on(event: string, handler: EventHandler) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(handler);
    }

    off(event: string, handler?: EventHandler) {
        if (!handler) {
            delete this.listeners[event];
        } else if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(h => h !== handler);
        }
    }

    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;
        for (const handler of this.listeners[event]) {
            handler(...args);
        }
    }
}
