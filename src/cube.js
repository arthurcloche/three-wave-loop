import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import waterVertexShader from "./shaders/water/vertex";
import waterFragmentShader from "./shaders/water/fragment";
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1, 512, 1, 512);
const material = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    PI: { value: Math.PI },
    uTex: { value: null },
    uWaveAmp: { value: 0.5 },
    uWaveNoise: { value: 1 },
  },
  side: THREE.DoubleSide,
  //   wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
textureLoader.load("/waves.jpg", (tex) => {
  material.uniforms.uTex.value = tex;
  material.needsUpdate = true;
});

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(-5, 3, -1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Clock
const clock = new THREE.Clock();
// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  material.uniforms.uTime.value = elapsedTime;
  window.requestAnimationFrame(tick);
};

tick();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
