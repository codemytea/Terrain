import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

let camera, controls, scene, renderer;
let mesh, texture, heightData, geometry;

const clock = new THREE.Clock();

const worldWidth = 100, worldDepth = 100;
const width = window.innerWidth, height = window.innerHeight;

/**
 * Issues:
 *
 * -goes black sometimes
 * -only as 10000x10000 size -> want to be infinite -> make it tiled
 * */


init();
animate();

function initialiseCamera(){
    camera = new THREE.PerspectiveCamera(60, width / height, 100, 10000);
    camera.position.set(100, 1000, - 800);
    //camera.lookAt(-100, 810, -800);
}

function initialiseScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0xF2DAC4, 0.0003);
}

function initialiseGeometry(){
    geometry = new THREE.PlaneGeometry(10000, 10000, worldWidth-1, worldDepth-1);
    geometry.rotateX( - Math.PI / 2 );
}

function initialiseTexture(){
    texture = new THREE.CanvasTexture({
        canvas: generateTexture(heightData, worldWidth, worldDepth),
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        colorSpace: THREE.SRGBColorSpace
    });
}

function addEventHandlers(){
    window.addEventListener( "resize", _ => {
        camera.aspect = width/height;
        camera.updateProjectionMatrix( );
        renderer.setSize( width, height );
        controls.handleResize()
    });
}

function addControl(){
    controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;
}

function init() {
    initialiseCamera();
    initialiseScene();
    initialiseGeometry();

    //it's this I want to move
    heightData = generateHeight(worldWidth, worldDepth);

    initialiseTexture()

    const vertices = geometry.attributes.position.array;

    //assign height to each vertex
    for (let i = 0; i < vertices.length; i++) {
        vertices[(i*3) + 1] = heightData[i] * 10;
    }

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x00ff00
    })

    //amalgamate the plane with vertex height points with the textured material
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.body.appendChild( renderer.domElement );

    addControl();
    addEventHandlers();
}

function generateHeight(width, height) {
    const size = width * height;
    const data = new Uint8Array( size );
    const perlin = new ImprovedNoise();
    const temp = Math.sin(Math.PI/4) * 10000
    const z = temp - Math.floor(temp) * 100;

    let quality = 1;

    for ( let j = 0; j < 4; j++ ) {
        for ( let i = 0; i < size; i++) {
            const x = (i % width);
            const y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x/quality, y/quality, z) * quality * 1.75);
        }
        quality *= 5;
    }

    return data;
}

function generateTexture( data, width, height ) {
    const vector3 = new THREE.Vector3(0, 0, 0);
    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    let image = context.getImageData(0, 0, canvas.width, canvas.height);
    let imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i ++) {
        vector3.x = data[i-2] - data[i+2];
        vector3.y = 2;
        vector3.z = data[i - width*2] - data[i + width*2];
        vector3.normalize();

        let shade = vector3.dot(sun);

        imageData[i*4] = (96 + shade * 128) * (0.5 + data[i] * 0.007);
        imageData[i+4 + 1] = (32 + shade * 96) * (0.5 + data[i] * 0.007);
        imageData[i*4 + 2] = (shade * 96) * ( 0.5 + data[i] * 0.007 );
    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x
    const canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( let i = 0, l = imageData.length; i < l; i += 4 ) {
        const v = ~~( Math.random() * 5 );
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}


function render(){
    controls.update(clock.getDelta());
    renderer.render( scene, camera );
}