import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.main').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = true;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 
    1, 
    0.1 
);
composer.addPass(bloomPass);

const texture = new THREE.TextureLoader().load('tex.jpg');
const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
const materials = [
    new THREE.MeshBasicMaterial({map: texture}), 
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('top.jpg')}), 
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('bottom.webp')}) 
];
const can = new THREE.Mesh(geometry, materials);
can.rotation.y = Math.PI / 2;
scene.add(can);

camera.position.z = 5;

gsap.registerPlugin(ScrollTrigger);

gsap.to(document.querySelector('.main h1'), {
    x: 1500,
    scrollTrigger: {
        trigger: ".page1",
        start: "top 100%",
        end: "top 0%",
        scrub: 2,
        pin: '.main',
    }
});

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.resolution.set(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    composer.render();
}

animate();
