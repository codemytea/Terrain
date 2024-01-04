import * as THREE from 'three'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import {SimplexNoise} from "three/addons";
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water2.js';
import {GUI} from "dat.gui";

let width = window.innerWidth, height = window.innerHeight;
const clock = new THREE.Clock();
let renderer, camera, scene, controls, sky, sun, cubeCamera, world;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setup(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 10)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xaaaaaa, 1000, 0, 0);
    pointLight.position.set(0, 0, 7000)
    pointLight.power = 1000;
    scene.add(pointLight);


    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 0, 10000)

    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);


    initSky();


    world = new THREE.SphereGeometry(5000, 1000, 1000);
    const world2 = new THREE.SphereGeometry(20, 600, 600);

    const vertexPositions = world.getAttribute('position').array;
    const vertexNormals = world.getAttribute('normal').array;

    const simplex = new SimplexNoise();
    let temp = getRandomInt(50, 60);


    for (let i = 0; i < vertexPositions.length; i += 3) {

        let relativeVertexPosition = simplex.noise3d(vertexPositions[i]/temp, vertexPositions[i+1]/temp, vertexPositions[i+2]/temp);
        // Extend the vertex along its normal
        vertexPositions[i] += vertexNormals[i] * relativeVertexPosition *10;
        vertexPositions[i + 1] += vertexNormals[i + 1] * relativeVertexPosition*10 ;
        vertexPositions[i + 2] += vertexNormals[i + 2] * relativeVertexPosition*10 ;
    }

    world.verticesNeedUpdate = true;


    const material = new THREE.MeshPhongMaterial({
        color: 0xbbbbff, // Deep blue color
        transparent: true,
        opacity: 0.4,
        reflectivity: 1,
        refractionRatio: 0.9, // Adjust the refraction ratio
        shininess: 100, // Adjust shininess for specular highlights
        envMap: cubeRenderTarget.texture,
        specular: 0xffffff, // Adjust specular color
        emissive: 0x00ff00, // No emissive color
    });

    console.log(JSON.stringify(cubeCamera))

    scene.add(new THREE.Mesh(world, material));
    scene.add(new THREE.Mesh(world2, new THREE.MeshBasicMaterial()));


    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 1500;
    controls.lookSpeed = 0.1;

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
    let d = clock.getDelta();

    const vertexes = world.getAttribute('position')
    const vertexPositions = vertexes.array;

    // Add wind effect based on elapsed time
    const windDirection = new THREE.Vector3(1, 0, 0); // Adjust the wind direction
    const windEffect = 100; // Adjust the strength of the wind effect

    for (let i = 0; i < vertexPositions.length; i += 3) {
        vertexPositions[i] += windDirection.x * windEffect * d;
        vertexPositions[i + 1] += windDirection.y * windEffect * d;
        vertexPositions[i + 2] += windDirection.z * windEffect * d;
    }

    // Update world geometry
    world.verticesNeedUpdate = true;
    vertexes.needsUpdate = true;

    controls.update(d);
    cubeCamera.update( renderer, scene );
    renderer.render(scene, camera);
}

setup();

/**
 * TODO
 *
 * put 5?? point lights everywhere
 * experiment with values
 * migrate to other file
 * merge with geometries
 *
 * **/
