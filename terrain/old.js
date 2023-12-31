import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

import {TerrainGenerator} from './terrain.js'

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
    const data = TerrainGenerator.generateHeight(worldWidth, worldDepth);
    for (let i = 0; i < vertices.length; i ++) {
        vertices[i*3 + 1] = data[i] * 7;
    }

    // texture = new THREE.CanvasTexture(TerrainGenerator.generateTexture(data, worldWidth, worldDepth));
    // texture.wrapS = THREE.ClampToEdgeWrapping;
    // texture.wrapT = THREE.ClampToEdgeWrapping;
    // texture.colorSpace = THREE.SRGBColorSpace;

    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());//{ map: texture, color:0x964B00 }));
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
 * Plan:
 *
 * understand the noise and texture stuff better
 * put in breakpoints in different levels
 * wrap to sphere by mapping coordinates
 * put in secondary water textured mesh
 *
 * look at web gl and vertex shaders
 *
 * make sky by perlin noise - just bigger sphere around sphere and 0-1 = distance of cloud and cloud factor for how freq they are
 * add in sun and other light sources
 *
 * add in fog
 *
 * make blender tree and boulder and birds and add in
 *
 *
 * make physics???? - camera shouldn't be able to go in.
 *
 * */


/** This final version adds map zooming and panning. */

class TerrainType {
    constructor(minHeight, maxHeight, minColor, maxColor, lerpAdjustment = 0) {
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.minColor = minColor;
        this.maxColor = maxColor;
        // An adjustment to the color lerp for the map type, this weighs the color
        // towards the min or max color.
        this.lerpAdjustment = lerpAdjustment;
    }
}

let waterTerrain;
let sandTerrain;
let grassTerrain;
let treesTerrain;

let zoomFactor = 100;
let mapChanged = true;
// The x and y offset need to be large because Perlin noise mirrors around 0.
let xOffset = 10000;
let yOffset = 10000;
const cameraSpeed = 10;

function setup() {
    createCanvas(600, 600);

    // Adjusts the level of detail created by the Perlin noise by layering
    // multiple versions of it together.
    noiseDetail(9, 0.5);

    // Perlin noise doesn't often go below 0.2, so pretend the min is 0.2 and not
    // 0 so that the colors are more evenly distributed. Otherwise, there is
    // little deep water represented. This is the same for setting the max for
    // 'trees' to 0.75: noise rarely goes above 0.8 and the tree colors look
    // better assuming 0.75 as the max.
    waterTerrain =
        new TerrainType(0.2, 0.4, color(30, 176, 251), color(40, 255, 255));
    sandTerrain =
        new TerrainType(0.4, 0.5, color(215, 192, 158), color(255, 246, 193), 0.3);
    grassTerrain =
        new TerrainType(0.5, 0.7, color(2, 166, 155), color(118, 239, 124));
    treesTerrain =
        new TerrainType(0.7, 0.75, color(22, 181, 141), color(10, 145, 113), -0.5);
}

function draw() {
    if (keyIsDown(RIGHT_ARROW)) {
        xOffset += 1 / zoomFactor * cameraSpeed;
        mapChanged = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
        xOffset -= 1 / zoomFactor * cameraSpeed;
        mapChanged = true;
    }
    if (keyIsDown(UP_ARROW)) {
        yOffset -= 1 / zoomFactor * cameraSpeed;
        mapChanged = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        yOffset += 1 / zoomFactor * cameraSpeed;
        mapChanged = true;
    }

    // We only need to re-draw the canvas if the map has changed.
    if (!mapChanged) {
        return;
    }

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            // Set xVal and yVal for the noise such that the map is centered around
            // the center of the canvas. Adding x and y offset values allows us to
            // move around the noise with the arrow keys.
            const xVal = (x - width / 2) / zoomFactor + xOffset;
            const yVal = (y - height / 2) / zoomFactor + yOffset;
            const noiseValue = noise(xVal, yVal);

            let terrainColor;
            // Compare the current noise value to each mapType max height and get the
            // terrain color accordingly. For easier extendability and less code
            // repetition you could store the terrain types in an array and iterate
            // over it with a for loop checking for maxHeight. For this example I just
            // wanted to keep it simple and similar to previous versions.
            if (noiseValue < waterTerrain.maxHeight) {
                terrainColor = getTerrainColor(noiseValue, waterTerrain);
            } else if (noiseValue < sandTerrain.maxHeight) {
                terrainColor = getTerrainColor(noiseValue, sandTerrain);
            } else if (noiseValue < grassTerrain.maxHeight) {
                terrainColor = getTerrainColor(noiseValue, grassTerrain);
            } else {
                terrainColor = getTerrainColor(noiseValue, treesTerrain);
            }
            set(x, y, terrainColor);
        }
    }
    updatePixels();
    mapChanged = false;
}

function getTerrainColor(noiseValue, mapType) {
    // Given a noise value, normalize to to be between 0 to 1 representing how
    // close it is to the min or max height for the given terrain type.
    const normalized =
        normalize(noiseValue, mapType.maxHeight, mapType.minHeight);
    // Blend between the min and max height colors based on the normalized
    // noise value.
    return lerpColor(mapType.minColor, mapType.maxColor,
        normalized + mapType.lerpAdjustment);
}

// Return a number between 0 and 1 between max and min based on value.
function normalize(value, max, min) {
    if (value > max) {
        return 1;
    }
    if (value < min) {
        return 0;
    }
    return (value - min) / (max - min);
}

function mouseWheel(event) {
    zoomFactor -= event.delta / 10;
    // Set the min zoom factor to 10 so that the map stays somewhat recognizeable.
    zoomFactor = Math.max(10, zoomFactor);
    mapChanged = true;
}