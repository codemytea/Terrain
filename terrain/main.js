import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import {GLTFLoader, SimplexNoise} from "three/addons";
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water2.js';
import {GUI} from "dat.gui";
import {noise} from './perlin'

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
    ${noise}
    uniform vec3 sphereOrigin;
    uniform vec3 fogColor;
    uniform float fogStart;
    uniform float fogEnd;
    uniform float time;
    uniform float fogNoiseSpeed;
    uniform float fogNoiseFrequency;
    uniform float fogNoiseImpact;
    uniform float fogDensity;
    
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
        
        vec3 windDir = vec3(0.0, 0.0, time);
        vec3 scrollingPos = vPosition + fogNoiseSpeed * windDir;
        float noise = cnoise(fogNoiseFrequency * scrollingPos.xyz);
        float vFogDepth = (1.0 - fogNoiseImpact * noise) * cameraDistance;
        float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
      
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
        vec3 foggedColor = mix(colour, fogColor, fogFactor);

        gl_FragColor = vec4(foggedColor, 1.0);
    }
`;



function setup(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    let fog = new THREE.Fog(0xffffff, 100, 1000 );
    //scene.fog = fog;

    let al = new THREE.AmbientLight(0xffffff, 10)
    scene.add(al)

    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 0, 10000)


    const world = new THREE.SphereGeometry(5000, 600, 600);
    //const water = new THREE.SphereGeometry(4940, 500, 500);
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
            sphereOrigin: { value: new THREE.Vector3(0, 0, 0) }, // Set the sphere's origin
            time: {value: 0},
            fogColor : { value: fog.color },
            fogNear : { value: fog.near },
            fogFar : { value: fog.far },
            fogNoiseSpeed: {value: 0.1},
            fogNoiseFrequency: {value: 0.003},
            fogNoiseImpact: {value: 0.5},
            fogDensity: {value: 0.0006}
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(world, material);
    //scene.add(mesh);

    blenderTreeInit("../lowPolyTree.glb", 0, 0, 0, 10).then(r => scene.add(r))

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 1500;
    controls.lookSpeed = 0.1;

   // initSky();

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
    controls.update(clock.getDelta());
    material.uniforms.time.value += clock.getDelta();
    renderer.render(scene, camera);
}

setup();


async function blenderTreeInit(filename, x, y, z, scale){
    let loader = new GLTFLoader()
    let gltf = await new Promise(resolve => loader.load(filename,  (gltf)=> resolve(gltf)))
    gltf.scene.traverse((node)=>{
        if (node.isMesh) {
            node.castShadow = true
            node.receiveShadow = true
        }
    })
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    gltf.scene.position.set(x, y, z)
    gltf.scene.scale.set(scale, scale, scale)

    return gltf.scene
}

/**
 * TODO:
 *
 * Add volumetric fog
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