import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcbe6ec);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);

const controls = new OrbitControls(camera, cssRenderer.domElement);
const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

loader.load('source/scene.gltf', function (gltf) {
    scene.add(gltf.scene);
    const monitor = gltf.scene.getObjectByName('monitor_screen');
    if (monitor) {
        // Create an iframe to load the HTML content
        const iframe = document.createElement('iframe');
        iframe.src = 'home.html';
        iframe.style.width = '1920px';
        iframe.style.height = '1080px';
        iframe.style.border = 'none';
        iframe.style.pointerEvents = 'none'; // Allow mouse events to pass through initially

        // Create a CSS3DObject from the iframe
        const cssObject = new CSS3DObject(iframe);
        cssObject.scale.set(0.00094, 0.00099, 0.00094); // Adjust scale as needed

        // Get the monitor's world position and rotation
        const monitorWorldPosition = new THREE.Vector3();
        const monitorWorldQuaternion = new THREE.Quaternion();
        monitor.getWorldPosition(monitorWorldPosition);
        monitor.getWorldQuaternion(monitorWorldQuaternion);

        // Set the CSS3DObject's position and rotation to match the monitor
        cssObject.position.copy(monitorWorldPosition);
        cssObject.quaternion.copy(monitorWorldQuaternion);

        // Offset the CSS3DObject to align with the monitor's screen
        cssObject.position.y += 2.7088; // Adjust this value based on the monitor's dimensions
        cssObject.position.z -= 0.267; // Adjust this value based on the monitor's dimensions
        cssObject.position.x -= -0.05;

        // Rotate the CSS3DObject 90 degrees horizontally
        cssObject.rotation.y += Math.PI / 2.1;

        // Add the CSS3DObject to the scene
        scene.add(cssObject);

        // Create a transparent overlay to capture mouse events
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.width = '1920px';
        overlay.style.height = '1080px';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.pointerEvents = 'none'; // Allow mouse events to pass through
        document.body.appendChild(overlay);

        // Add event listener to update mouse position
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Add event listener to disable controls when iframe is clicked
        overlay.addEventListener('click', () => {
            controls.enabled = false;
            iframe.style.pointerEvents = 'auto';
        });

        // Add event listener to re-enable controls when clicking outside the iframe
        document.addEventListener('click', (event) => {
            if (!iframe.contains(event.target)) {
                controls.enabled = true;
                iframe.style.pointerEvents = 'none';
            }
        });

        // Function to check for intersections and enable pointer events
        function checkIntersections() {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(cssObject);
            if (intersects.length > 0) {
                overlay.style.pointerEvents = 'auto';
            } else {
                overlay.style.pointerEvents = 'none';
            }
        }

        // Add event listener for mouse clicks to move the camera
        window.addEventListener('click', (event) => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(gltf.scene.getObjectByName('Cube002'));
            if (intersects.length > 0) {
                // Move the camera to a new position
                camera.position.set(1.56, 2.67, -0.20); // Adjust these values as needed
                camera.rotation.set(-0.40, 1.47, -0.40);
                controls.update();
            }
        });
        const infoDiv = document.createElement('div');
        infoDiv.style.position = 'absolute';
        infoDiv.style.top = '10px';
        infoDiv.style.left = '10px';
        infoDiv.style.color = 'black';
        infoDiv.style.backgroundColor = 'white';
        infoDiv.style.padding = '5px';
        infoDiv.style.fontFamily = 'monospace';
        document.body.appendChild(infoDiv);

        function updateCameraInfo() {
            infoDiv.innerHTML = `
                <strong>Camera Position:</strong><br>
                x: ${camera.position.x.toFixed(2)}<br>
                y: ${camera.position.y.toFixed(2)}<br>
                z: ${camera.position.z.toFixed(2)}<br>
                <strong>Camera Rotation:</strong><br>
                x: ${camera.rotation.x.toFixed(2)}<br>
                y: ${camera.rotation.y.toFixed(2)}<br>
                z: ${camera.rotation.z.toFixed(2)}
            `;
        }

        // Call checkIntersections in the animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);
            checkIntersections();
            updateCameraInfo(); // Update camera info on each frame
        }
        animate();
    }
}, undefined, function (error) {
    console.error(error);
});

camera.position.set(9.154, 6.613, 7.786); 
camera.lookAt(0, 0, 0);