export const vertexShader = `
uniform float uTime;
attribute float aBrightness;
varying float vBrightness;

void main() {
    vBrightness = aBrightness * (0.8 + 0.2 * sin(uTime + position.x * 0.1));
    gl_PointSize = 2.0; // можно подгонять
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
varying float vBrightness;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard; // круглая точка
    gl_FragColor = vec4(vec3(vBrightness), 1.0);
}
`;