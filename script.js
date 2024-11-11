import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.main').appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.7, 
    1.7, 
    0.1 
);
composer.addPass(bloomPass);

const texture = new THREE.TextureLoader().load('tex.jpg');
const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
const material = new THREE.MeshBasicMaterial({map: texture});
const can = new THREE.Mesh(geometry, material);
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
})

document.querySelector('.main').addEventListener('mousemove', (e) => {
    gsap.to(can.rotation, {
        y: (e.clientX/window.innerWidth)*Math.PI,
        duration: 0.7,
    })
})

function animate() {
    requestAnimationFrame(animate);
    composer.render();
}

animate();
