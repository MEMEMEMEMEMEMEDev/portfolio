export const vertexShaderSource = `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

#define STARTUP_TIME 10.0
#define NOISE_STRENGTH 0.1

#define HORIZON_POS 0.47      
#define HORIZON_INTENSITY 1.4 

#define CIRCUIT_SPEED 0.5     
#define CIRCUIT_BRIGHTNESS 0.8

#define FOG_DENSITY 1.5      
#define GOLD_LIGHT_STR 1.0   

float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fogFbm(vec2 st) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    vec2 q = vec2(noise(st), noise(st + vec2(5.2, 1.3)));
    st += q * 0.5; 
    for (int i = 0; i < 5; i++) {
        v += a * noise(st);
        st = rot * st * 2.0;
        a *= 0.5;
    }
    return v;
}


float getHorizonLine(vec2 st, float time) {
    float dist = abs(st.y - HORIZON_POS);
    float beam = smoothstep(0.0035, 0.001, dist);
    float widthMask = smoothstep(0.98, 0.4, abs(st.x - 0.5) * 2.0);
    float breath = 0.9 + 0.1 * sin(time * 1.5);
    return beam * widthMask * breath;
}

float getCopperTraces(vec2 st, float time) {
    vec2 grid = st * vec2(90.0, 1.0); 
    vec2 id = floor(grid);
    vec2 f = fract(grid);

    float activeLine = step(0.88, hash21(vec2(id.x, 73.0))); 

    float lineWidth = 0.07; 
    float lineShape = smoothstep(lineWidth, 0.0, abs(f.x - 0.5));
    
    float speed = time * (0.3 + hash21(vec2(id.x)) * 0.8) * CIRCUIT_SPEED + 1.0; 
    float pulsePos = fract(st.y * 0.5 - speed);
    
    float pulse = smoothstep(1.0, 0.9, pulsePos) * 2.0; 
    pulse += smoothstep(0.0, 1.0, pulsePos) * 0.2;      
    
    float breathing = 0.5 + 0.5 * sin(time * 0.5 + id.x);

    return lineShape * activeLine * pulse * breathing;
}

float getMonoliths(vec2 st) {
    float numCols = 6.0; 
    vec2 f = fract(st * numCols);
    float wall = smoothstep(0.04, 0.06, f.x) * smoothstep(0.96, 0.94, f.x);
    return wall;
}

float getWaterLight(vec2 st, float time) {
    float t = time * 0.08; 
    vec2 scaleSt = vec2(st.x * 0.8, st.y * 0.4); 
    float f = fogFbm(scaleSt + vec2(0.0, t));
    return smoothstep(0.35, 0.85, f) * smoothstep(0.95, 0.55, f); 
}

float getDust(vec2 st, float time) {
    vec2 grid = st * 50.0;
    vec2 id = floor(grid);
    vec2 f = fract(grid);
    float n = hash21(id);
    vec2 offset = vec2(sin(time * 0.3 + n * 10.0), cos(time * 0.2 + n * 20.0)) * 0.2;
    float d = length(f - 0.5 - offset);
    return smoothstep(0.05, 0.0, d) * step(0.92, n);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = st;
    st.x *= u_resolution.x / u_resolution.y;

    float t = u_time + STARTUP_TIME;

    vec3 color = vec3(0.008, 0.005, 0.003);

    float horizon = getHorizonLine(st, t);
    vec3 horizonColor = vec3(1.0, 0.5, 0.1); 
    color += horizon * horizonColor * HORIZON_INTENSITY; 

    float traces = getCopperTraces(st, t);
    vec3 copperColor = vec3(1.0, 0.6, 0.3); 
    color += traces * copperColor * CIRCUIT_BRIGHTNESS; 

    float pillars = getMonoliths(st);
    color *= 1.0 - (pillars * 0.98); 

    float fog = fogFbm(st * FOG_DENSITY - vec2(0.0, t * 0.03));
    float fogMask = smoothstep(1.3, -0.1, st.y); 
    
    float light = getWaterLight(st, t);
    vec3 goldLight = vec3(1.0, 0.8, 0.5) * GOLD_LIGHT_STR;
    
    color += fog * fogMask * vec3(0.12, 0.08, 0.04);
    color += light * goldLight * fogMask * 0.25;     
    
    float edge = abs(dFdx(pillars)) * 2.0; 
    color += edge * goldLight * light * 0.6; 
    color += pillars * light * goldLight * 0.08; 

    float dust = getDust(st, t);
    color += dust * vec3(1.0, 0.9, 0.7) * (0.2 + 1.5 * light * fogMask);

    float dist = distance(uv, vec2(0.5));
    color *= smoothstep(1.4, 0.3, dist); // Vignette

    color = pow(color, vec3(1.1)); // Contraste
    color = mix(color, color * vec3(1.05, 1.0, 0.9), 0.1); // Grading

    float grain = hash21(uv * 1000.0 + t * 10.0) - 0.5; 
    color += grain * NOISE_STRENGTH;

    fragColor = vec4(color, 1.0);
}
`;
