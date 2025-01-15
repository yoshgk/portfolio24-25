import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import gsap from 'gsap';

// -----------------------
// Scene, Camera, and Renderers
// -----------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Default camera values (for reverting)
const defaultCameraPosition = new THREE.Vector3(6.55, 3.61, 4.96);
const defaultControlsTarget = new THREE.Vector3(-0.63, 0.82, 0.49);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.copy(defaultCameraPosition);

// WebGL Renderer (behind CSS3DRenderer)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '0';
// Disable pointer events on the WebGL canvas so the iframes can be clicked.
renderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(renderer.domElement);

// CSS3D Renderer (in front)
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.zIndex = '999';
cssRenderer.domElement.style.pointerEvents = 'auto';
document.body.appendChild(cssRenderer.domElement);

// OrbitControls (initially enabled)
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.target.copy(defaultControlsTarget);
controls.enableDamping = true;
controls.update();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------
// Load 3D Model and Get Objects
// -----------------------
const loader = new GLTFLoader();
let monitor = null;
let laptop = null;
loader.load('source/desk.glb', (gltf) => {
  scene.add(gltf.scene);
  monitor = gltf.scene.getObjectByName('monitor');
  laptop = gltf.scene.getObjectByName('laptop');
});

// -----------------------
// Global State Variables for Iframe Management
// -----------------------
let activeScreen = null; // can be 'monitor' or 'laptop'
let monitorHTML = null;
let laptopHTML = null;

// -----------------------
// Iframe Creation Functions
// -----------------------

// For the monitor (displays home.html)
function createMonitorHTML() {
  const iframe = document.createElement('iframe');
  iframe.src = 'home.html'; // Adjust URL as needed
  iframe.style.width = '63%';
  iframe.style.height = '71.5%';
  iframe.style.position = 'absolute';
  iframe.style.border = 'none';
  iframe.style.zIndex = '1000';
  iframe.style.pointerEvents = 'auto';
  iframe.style.backgroundColor = 'white'; // For debugging (optional)
  iframe.style.top = '50%';
  iframe.style.left = '50%';
  iframe.style.transform = 'translate(-50%, -50%)';
  iframe.style.opacity = '1';
  document.body.appendChild(iframe);
  return iframe;
}

// For the laptop (displays about.html)
function createLaptopHTML() {
  const iframe = document.createElement('iframe');
  iframe.src = 'about.html'; // Adjust URL as needed
  iframe.style.width = '60.8%';
  iframe.style.height = '67.98%';
  iframe.style.position = 'absolute';
  iframe.style.border = 'none';
  iframe.style.zIndex = '1000';
  iframe.style.pointerEvents = 'auto';
  iframe.style.backgroundColor = 'white'; // For debugging (optional)
  iframe.style.top = '39.13%';
  iframe.style.left = '50.5%';
  iframe.style.transform = 'translate(-50%, -50%)';
  iframe.style.opacity = '1';
  document.body.appendChild(iframe);
  return iframe;
}

// -----------------------
// Functions to Open the Iframes and Animate the Camera
// -----------------------

// When the monitor is clicked
function onMonitorClicked() {
  if (!activeScreen && monitor) {
    activeScreen = 'monitor';

    const lookAtTarget = new THREE.Vector3();
    monitor.getWorldPosition(lookAtTarget);

    // Animate camera to monitor-specific position
    gsap.to(camera.position, {
      x: 1.77,
      y: 2.77,
      z: -0.11,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        controls.target.copy(lookAtTarget);
        controls.update();
      },
      onComplete: () => {
        monitorHTML = createMonitorHTML();
        controls.enabled = false;
        console.log('Monitor iframe created. Controls disabled.');
        // Add listener for clicks outside the iframe.
        window.addEventListener('click', onOutsideClick, true);
      },
    });
  }
}

// When the laptop is clicked
function onLaptopClicked() {
  if (!activeScreen && laptop) {
    activeScreen = 'laptop';

    const lookAtTarget = new THREE.Vector3();
    laptop.getWorldPosition(lookAtTarget);
    const offset = new THREE.Vector3(-1.5, 0, -0.16);
    lookAtTarget.add(offset);

    // Animate camera to laptop-specific position
    // (Adjust these numbers to fit your scene’s layout)
    gsap.to(camera.position, {
      x: 0.91,
      y: 2.32,
      z: 1.65,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        controls.target.copy(lookAtTarget);
        controls.update();
      },
      onComplete: () => {
        laptopHTML = createLaptopHTML();
        controls.enabled = false;
        console.log('Laptop iframe created. Controls disabled.');
        // Add listener for clicks outside the iframe.
        window.addEventListener('click', onOutsideClick, true);
      },
    });
  }
}

// -----------------------
// Function to Detect Clicks Outside the Iframe and Close It
// -----------------------
function onOutsideClick(event) {
  if (activeScreen === 'monitor' && monitorHTML) {
    if (!(event.target === monitorHTML || monitorHTML.contains(event.target))) {
      window.removeEventListener('click', onOutsideClick, true);
      gsap.to(monitorHTML, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          monitorHTML.remove();
          monitorHTML = null;
          activeScreen = null;
          revertCamera();
        },
      });
    }
  } else if (activeScreen === 'laptop' && laptopHTML) {
    if (!(event.target === laptopHTML || laptopHTML.contains(event.target))) {
      window.removeEventListener('click', onOutsideClick, true);
      gsap.to(laptopHTML, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          laptopHTML.remove();
          laptopHTML = null;
          activeScreen = null;
          revertCamera();
        },
      });
    }
  }
}

// -----------------------
// Function to Revert the Camera and Re-enable Controls
// -----------------------
function revertCamera() {
  gsap.to(camera.position, {
    x: defaultCameraPosition.x,
    y: defaultCameraPosition.y,
    z: defaultCameraPosition.z,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: () => {
      controls.target.copy(defaultControlsTarget);
      controls.update();
    },
    onComplete: () => {
      controls.enabled = true;
      console.log('Camera reverted. Controls re-enabled.');
    },
  });
}

// -----------------------
// Raycasting to Detect Clicks on Monitor or Laptop
// -----------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // If an iframe is active, skip 3D click detection.
  if (activeScreen) return;

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  const monitorIntersects = raycaster.intersectObject(monitor, true);
  const laptopIntersects = raycaster.intersectObject(laptop, true);
  
  if (monitorIntersects.length > 0) {
    onMonitorClicked();
  } else if (laptopIntersects.length > 0) {
    onLaptopClicked();
  }
}

window.addEventListener('click', onMouseClick);

// -----------------------
// Debug Info Overlay (Optional)
// -----------------------
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

// -----------------------
// Main Render Loop
// -----------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
  updateCameraInfo();
}
animate();

function updateCameraInfo() {
  infoDiv.innerHTML = `
    <strong>Camera Position:</strong><br>
    x: ${camera.position.x.toFixed(2)}<br>
    y: ${camera.position.y.toFixed(2)}<br>
    z: ${camera.position.z.toFixed(2)}<br><br>
    <strong>Camera Rotation:</strong><br>
    x: ${camera.rotation.x.toFixed(2)}°<br>
    y: ${camera.rotation.y.toFixed(2)}°<br>
    z: ${camera.rotation.z.toFixed(2)}°<br>
  `;
}
