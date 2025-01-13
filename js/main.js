import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// 1) Create Scene, Main Camera, Renderers
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Main camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderers
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);

camera.position.set(6.55, 3.61, 4.96);
// 4) OrbitControls
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.target.set(-0.63, 0.82, 0.49);
controls.enableDamping = true;
controls.update(); // sync with the new camera position

// \*NEW\* Debug info div
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.top = '10px';
infoDiv.style.left = '10px';
infoDiv.style.padding = '5px 10px';
infoDiv.style.color = 'black';
infoDiv.style.backgroundColor = 'white';
infoDiv.style.fontFamily = 'monospace';
infoDiv.style.fontSize = '14px';
infoDiv.style.zIndex = '999';
document.body.appendChild(infoDiv);

// Handle Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// 2) Load GLTF
const loader = new GLTFLoader();
loader.load('source/desk.glb', (gltf) => {
  scene.add(gltf.scene);

  // Example: Adjust sun light
  const sunLight = gltf.scene.getObjectByName('Sun');
  if (sunLight) {
    sunLight.intensity = 2.0;
  }

  // If there's a monitor object, attach an iframe
  const monitor = gltf.scene.getObjectByName('monitor');
  if (monitor) {
    addIframeToMonitor(monitor);
  }
});

function addIframeToMonitor(monitor) {
  const iframe = document.createElement('iframe');
  iframe.src = 'home.html';
  iframe.style.width = '1920px';
  iframe.style.height = '1080px';
  iframe.style.border = 'none';
  iframe.style.pointerEvents = 'none';

  const cssObject = new CSS3DObject(iframe);

  // Copy monitor's transform
  const worldPos = new THREE.Vector3();
  const worldQuat = new THREE.Quaternion();
  monitor.getWorldPosition(worldPos);
  monitor.getWorldQuaternion(worldQuat);
  cssObject.position.copy(worldPos);
  cssObject.quaternion.copy(worldQuat);

  cssObject.scale.set(0.00094, 0.00099, 0.00094);
  // Slight offset to prevent z-fighting
  const offsetVector = new THREE.Vector3(0, 0, 0.0001);
  offsetVector.applyQuaternion(worldQuat);
  cssObject.position.add(offsetVector);

  scene.add(cssObject);

  // If you want to enable clicking inside the iframe
  iframe.style.pointerEvents = 'auto';
}

// \*NEW\* Function to update the debug text
function updateCameraInfo() {
  infoDiv.innerHTML = `
    <strong>Camera Position:</strong><br>
    x: ${camera.position.x.toFixed(2)}<br>
    y: ${camera.position.y.toFixed(2)}<br>
    z: ${camera.position.z.toFixed(2)}<br>
    <strong>Camera Rotation (Radians):</strong><br>
    x: ${camera.rotation.x.toFixed(2)}<br>
    y: ${camera.rotation.y.toFixed(2)}<br>
    z: ${camera.rotation.z.toFixed(2)}
  `;
}

// 5) Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);

  // \*NEW\* Update camera debug info every frame
  updateCameraInfo();
}
animate();

// camera.position.set(1.46, 2.66, -0.12);
// camera.rotation.set(-0.50, 1.47, -0.49);