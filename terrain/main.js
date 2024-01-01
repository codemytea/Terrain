import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import {TerrainGenerator} from './terrain.js'
import {SimplexNoise} from "three/addons";
import { Sky } from 'three/addons/objects/Sky.js';
import {GUI} from "dat.gui";

let width = window.innerWidth, height = window.innerHeight;
const clock = new THREE.Clock();
let renderer, camera, scene, controls, sky, sun, material;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
    uniform vec3 sphereOrigin;
    uniform vec3 fogColor;
    uniform float fogStart;
    uniform float fogEnd;
    //uniform vec3 cameraPosition; 
    
    varying vec3 vPosition;

    const float minRiverDistance = 4800.0;
    const float maxRiverDistance = 4949.0;
    
    const float minSiltDistance = 4949.0;
    const float maxSiltDistance = 4950.0;
    
    const float minMossDistance = 4950.0;
    const float maxMossDistance = 5030.0;
    
    const float minSoilDistance = 5030.0;
    const float maxSoilDistance = 5250.0;
    
    const float minSnowDistance = 5250.0;
    const float maxSnowDistance = 6000.0;
    
    vec3 hexToVec3(float r, float g, float b) {
        return vec3(r / 255.0, g / 255.0, b / 255.0);
    }

    void main() {
        float distance = length(vPosition - sphereOrigin);
        float cameraDistance = length(vPosition - cameraPosition);
    
        vec3 riverColour = hexToVec3(56.0, 77.0, 71.0);
        vec3 siltColour = hexToVec3(107.0, 116.0, 120.0);
        vec3 mossColour = hexToVec3(124.0, 142.0, 81.0);
        vec3 soilColour = hexToVec3(65.0, 65.0, 65.0);
        vec3 snowColour = hexToVec3(207.0, 217.0, 206.0);
    
        float tRiver = smoothstep(minRiverDistance, maxRiverDistance, distance);
        float tSilt = smoothstep(minSiltDistance, maxSiltDistance, distance);
        float tMoss = smoothstep(minMossDistance, maxMossDistance, distance);
        float tSoil = smoothstep(minSoilDistance, maxSoilDistance, distance);
        float tSnow = smoothstep(minSnowDistance, maxSnowDistance, distance);
    
        vec3 colour = mix(riverColour, siltColour, tRiver);
        colour = mix(colour, mossColour, tSilt);
        colour = mix(colour, soilColour, tMoss);
        colour = mix(colour, snowColour, tSoil);

        // Apply fog color
        float fogFactor = smoothstep(fogStart, fogEnd, cameraDistance);
        vec3 foggedColor = mix(colour, fogColor, cameraDistance/7000.0);

        gl_FragColor = vec4(foggedColor, 1.0);
    }
`;



function setup(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    let fog = new THREE.Fog(0xffffff, 100, 1000 );
    scene.fog = fog;

    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 0, 10000)


    const world = new THREE.SphereGeometry(5000, 600, 600);
    const vertexPositions = world.getAttribute('position').array;
    const vertexNormals = world.getAttribute('normal').array;

    const simplex = new SimplexNoise();
    let temp = getRandomInt(500, 600)

    for (let i = 0; i < vertexPositions.length; i += 3) {

        let relativeVertexPosition = simplex.noise3d(vertexPositions[i]/temp, vertexPositions[i+1]/temp, vertexPositions[i+2]/temp);
        // Extend the vertex along its normal
        vertexPositions[i] += vertexNormals[i] * relativeVertexPosition * 150;
        vertexPositions[i + 1] += vertexNormals[i + 1] * relativeVertexPosition * 150;
        vertexPositions[i + 2] += vertexNormals[i + 2] * relativeVertexPosition * 150;
    }

    world.verticesNeedUpdate = true;

     material = new THREE.ShaderMaterial({
        uniforms: {
            //cameraPosition : { value: camera.position }, // Pass camera position to the shader
            sphereOrigin: { value: new THREE.Vector3(0, 0, 0) }, // Set the sphere's origin
            fogColor : { value: fog.color },
            fogNear : { value: fog.near },
            fogFar : { value: fog.far },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(world, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 1500;
    controls.lookSpeed = 0.1;

    initSky();

    eventListeners();
    animate();
}

//toDO - add time changing + dif options eg winter sun, summer sun, early morning etc
function initSky() {

    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render( scene, camera );

    }

    const gui = new GUI();

    gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

    guiChanged();

}

function eventListeners(){
    window.addEventListener('resize', _ => {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        controls.handleResize();
    });
}

function animate(){
    requestAnimationFrame(animate);
    //material.uniforms.cameraPosition.value.copy(camera.position);
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}

setup();

/**
 * TODO:
 *
 * Add fog
 * Add textures to silt and water and snow
 * Add clouds
 *
 * Make blender model of trees and rocks
 * add to world
 *
 * add physics - cannot go into world or tree etc
 * add flying camera only x above planet
 *
 * read on tiling perlin noise - modulo?
 * */