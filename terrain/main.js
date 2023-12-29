import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Sky } from 'three/addons/objects/Sky.js';

let camera, controls, scene, renderer;
let mesh, texture;

let width = window.innerWidth, height = window.innerHeight;
const worldWidth = 256, worldDepth = 256;
const clock = new THREE.Clock();

function init() {
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(100, 800, - 800);
    camera.lookAt(- 100, 810, - 800);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0xF7E7D9, 0.0009);

    const geometry = new THREE.PlaneGeometry(10000, 10000, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(- Math.PI / 2);

    const vertices = geometry.attributes.position.array;
    const data = generateHeight(worldWidth, worldDepth);
    for (let i = 0; i < vertices.length; i ++) {
        vertices[i*3 + 1] = data[i] * 7;
    }

    texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, color:0x964B00 }));
    scene.add(mesh);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 1500;
    controls.lookSpeed = 0.1;

    window.addEventListener('resize', _ => {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        controls.handleResize();
    });
}


function generateHeight(width, height) {
    const size = width * height
    const data = new Uint8Array(size);
    const perlin = new ImprovedNoise()
    const temp = Math.sin(Math.PI/4) * 10000
    const z = (temp - Math.floor(temp)) * 100;

    let quality = 1;

    for (let j = 0; j < 4; j ++) {
        for (let i = 0; i < size; i ++) {
            const x = i % width
            const y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }
        quality *= 5;
    }

    return data;
}

function generateTexture(data, width, height) {
    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    let image = context.getImageData(0, 0, canvas.width, canvas.height);
    let imageData = image.data;

    for (let i = 0; i < imageData.length; i ++) {
        vector3.x = data[i - 2] - data[i + 2];
        vector3.y = 2;
        vector3.z = data[i - width * 2] - data[i + width * 2];
        vector3.normalize();

        const shade = vector3.dot(sun);

        imageData[i*4] = (96 + shade * 128) * (0.5 + data[i] * 0.007);
        imageData[i*4 + 1] = (32 + shade * 96) * (0.5 + data[i] * 0.007);
        imageData[i*4 + 2] = (shade * 96) * (0.5 + data[i] * 0.007);
    }

    context.putImageData(image, 0, 0);

    return canvas;
}


function animate() {
    requestAnimationFrame(animate);
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}

function main(){
    init();
    animate();
}

main();



/**
 * todo: infinite terrain
 *
 * var cols, rows;
 * var scl = 20;
 * var w = 1400;
 * var h = 1000;
 *
 * var flying = 0;
 *
 * var terrain = [];
 *
 * function setup() {
 *   createCanvas(600, 600, WEBGL);
 *   cols = w / scl;
 *   rows = h / scl;
 *
 *   for (var x = 0; x < cols; x++) {
 *     terrain[x] = [];
 *     for (var y = 0; y < rows; y++) {
 *       terrain[x][y] = 0; //specify a default value for now
 *     }
 *   }
 * }
 *
 * function draw() {
 *
 *   flying -= 0.05;
 *   var yoff = flying;
 *   for (var y = 0; y < rows; y++) {
 *     var xoff = 0;
 *     for (var x = 0; x < cols; x++) {
 *       terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
 *       xoff += 0.2;
 *     }
 *     yoff += 0.2;
 *   }
 *
 *
 *   background(0);
 *   translate(0, 50);
 *   rotateX(PI / 3);
 *   fill(200, 200, 200, 150);
 *   translate(-w / 2, -h / 2);
 *   for (var y = 0; y < rows - 1; y++) {
 *     beginShape(TRIANGLE_STRIP);
 *     for (var x = 0; x < cols; x++) {
 *       vertex(x * scl, y * scl, terrain[x][y]);
 *       vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
 *     }
 *     endShape();
 *   }
 * }
 * */
