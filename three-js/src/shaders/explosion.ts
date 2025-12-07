export const vertexShader = `
    attribute vec3 aDir;
    attribute float aSpeed;
    attribute float aAlpha;

    uniform float time;
    uniform float life;

    varying float vAlpha;

    void main() {
        vAlpha = aAlpha * (1.0 - time / life);
        vec3 pos = aDir * aSpeed * time * 5.0;
        gl_PointSize = 6.0 * (1.0 - aAlpha) + 3.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
            
export const fragmentShader = `
    varying float vAlpha;

    void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        float a = vAlpha * smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(1.0, 0.8, 0.3, a);
    }
`;