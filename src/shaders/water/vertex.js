import { map, perlin3d, rotation3d } from "../utils";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float PI;
  uniform float uWaveAmp;
  uniform float uWaveNoise;

  varying float vElevation;
  varying float vT;
  varying vec2 vUv;
  varying vec3 n;
  ${perlin3d}
  ${rotation3d}
  ${map}

  vec4 displace(vec3 p) {
    vec3 q = p;
    float ld = 2.;
    float off = -q.z * 1.25 * (ld / 4.);
    float t = mod(uTime + off, ld) / ld;
    float u = t * PI * 2.;

    if(q.y > 0.){
    q.y += sin(u + 2. - cos(u + .5) * .5) * uWaveAmp;
    //q.z += cos(u) * uWaveAmp;
    }
    return vec4(q, u);
  }

  void main() {
    // vec3 rotated = (vec4(position, 1.) * rotation3d(vec3(0., 2., 0.), -PI/2.)).xyz;
    vec4 pos = displace(position);
    float u = pos.a;
    float yoff,zoff = 0.;
    float fy = sin(u) * .5 + .5;
    if(position.y > 0.){
    

    yoff = cnoise(vec3(position * 2. + uTime * .5)) * mix(.1, .3, fy) +
                 cnoise(vec3(position * 4. + uTime * .5)) * mix(.1, .3, fy) * .5 +
                 cnoise(vec3(position * 8. + uTime * .5)) * mix(.1, .3, fy) * .25;

    pos.y += yoff * uWaveNoise;
    /*
    zoff = cnoise(vec3(position * .5 + vec3(uTime, 0., 0.) * .0)) * .5 +
                 cnoise(vec3(position * 1.)) * .3 +
                 cnoise(vec3(position * 4.)) * .15;

    float fz = sin(u + 2.) * .5 + .5;
    pos.z += zoff * fz * uWaveNoise;
    */
    }
    
    vec4 modelPosition = modelMatrix * vec4(pos.xyz, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    n = normal;
    vT = sin(u - 1.75 + yoff) * .5 + .5;

    float yd = uWaveAmp + mix(.1, .3, fy) * 1.75;
    vElevation = smoothstep(.1, .75, map(pos.y, -yd, yd, 0., 1.));
    // vElevation = clamp(map(pos.y, -.6, .25, 0., 1.), 0., 1.);
}`;

export default vertexShader;
