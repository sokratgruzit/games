export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
    const p = 1 - Math.pow(1 - t, 3);
    return p;
}