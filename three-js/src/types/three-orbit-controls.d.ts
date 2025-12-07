declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, MOUSE, TOUCH, Vector3, Object3D } from "three";

    export class OrbitControls extends EventDispatcher {
        constructor(object: Camera, domElement?: HTMLElement);

        object: Camera;
        domElement: HTMLElement | undefined;

        enabled: boolean;
        target: Vector3;

        // вращение
        minPolarAngle: number;
        maxPolarAngle: number;
        minAzimuthAngle: number;
        maxAzimuthAngle: number;

        // зум
        enableZoom: boolean;
        zoomSpeed: number;
        minDistance: number;
        maxDistance: number;

        // панорамирование
        enablePan: boolean;
        panSpeed: number;

        enableDamping: boolean;
        dampingFactor: number;

        rotateSpeed: number;

        update(): void;
        reset(): void;

        dispose(): void;

        // события
        addEventListener(type: string, listener: (event: any) => void): void;
        removeEventListener(type: string, listener: (event: any) => void): void;
        dispatchEvent(event: { type: string; [attachment: string]: any }): void;

        static MOUSE: typeof MOUSE;
        static TOUCH: typeof TOUCH;
    }
}
