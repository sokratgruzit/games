export const vertexShader = `
uniform float uTime;
attribute float aPhase;
attribute float aScale;
varying float vAlpha;

void main() {
    vec3 pos = position;

    // сложное перетекание внутри облака
    pos.x += sin(uTime + aPhase * 1.3 + position.y) * 1.5 * aScale;
    pos.y += cos(uTime * 0.7 + aPhase * 0.8 + position.z) * 1.2 * aScale;
    pos.z += sin(uTime * 0.5 + aPhase * 1.7 + position.x) * 1.0 * aScale;

    vAlpha = 0.2 + 0.3 * aScale; // прозрачность зависит от масштаба
    gl_PointSize = 4.0 * aScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = `
uniform vec3 uColor;
varying float vAlpha;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha); // цвет облака задается через uniform
}
`;
