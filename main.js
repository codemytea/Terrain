import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import {func} from "three/addons/nodes/code/FunctionNode";

let camera, controls, scene, renderer;
let mesh, texture, data;

const worldWidth = 100, worldDepth = 100;
const clock = new THREE.Clock();

const width = window.innerWidth, height = window.innerHeight;

/**
 * Issues:
 *
 * -goes black sometimes
 * -only as 10000x10000 size -> want to be infinite -> make it tiled
 * */


init();
animate();

function setUpCamera(){
    camera = new THREE.PerspectiveCamera(60, width / height, 100, 10000);
    camera.position.set(100, 1000, - 800);
    camera.lookAt(- 100, 810, - 800);
}

function setUpScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0xF2DAC4, 0.001);
}

function setUpRenderer(){
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
}

function setUpControls(){
    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;
}

function addEventListeners(){
    window.addEventListener("resize", (event) => {
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        controls.handleResize()
    });
}

function init() {

    setUpCamera();
    setUpScene();


    const geometry = new THREE.PlaneGeometry(10000, 10000,worldWidth - 1, worldDepth - 1);
    geometry.rotateX(- Math.PI / 2);

    const vertices = geometry.attributes.position.array;

    data = generateHeight(worldWidth, worldDepth);

    for (let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3) {

        vertices[j + 1] = data[i] * 10;

    }

    texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({map: texture, color: 0x00ff00})

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    setUpRenderer();

    setUpControls();

    addEventListeners();

}

function generateHeight(width, height) {

    let seed = Math.PI / 4;
    window.Math.random = function () {

        const x = Math.sin(seed ++) * 10000;
        return x - Math.floor(x);

    };

    const size = width * height, data = new Uint8Array(size);
    const perlin = new ImprovedNoise(), z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j ++) {

        for (let i = 0; i < size; i ++) {

            const x = i % width, y = ~ ~ (i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

        }

        quality *= 5;

    }

    return data;

}

function generateTexture(data, width, height) {

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {

        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();

        shade = vector3.dot(sun);

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);

    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {

        const v = ~ ~ (Math.random() * 5);

        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;

    }

    context.putImageData(image, 0, 0);

    return canvasScaled;

}

//

function animate() {
    requestAnimationFrame(animate);
    render();
}


function render() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}