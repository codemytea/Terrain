import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const width = window.innerWidth, height = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 55, width / height, 45, 30000);

camera.position.set(-900, -200,-900)

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

let controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', renderer);
controls.minDistance = 500;
controls.maxDistance = 1500;

var ambientLight = new THREE.AmbientLight( 'red', 0.5 );
scene.add( ambientLight );

var light = new THREE.DirectionalLight( 'red', 0.5 );
light.position.set( 1, 1, 1 );
scene.add( light );


var materials = [
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_front.png'),
        side: THREE.BackSide
    } ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_back.png'),
        side: THREE.BackSide
    } ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_up.png'),
        side: THREE.BackSide
    } ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_down.png'),
        side: THREE.BackSide
    } ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_right.png'),
        side: THREE.BackSide
    } ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'public/standard_skybox_left.png'),
        side: THREE.BackSide
    } )
];

const geometry = new THREE.BoxGeometry( 10000, 10000, 10000 );

const skybox = new THREE.Mesh( geometry, materials );

scene.add( skybox );
animate()

window.addEventListener( "resize", _ => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( innerWidth, innerHeight );
});

function animate() {
    requestAnimationFrame(animate)
    controls.update();
    renderer.render(scene,camera);
}

//is being in a box the right thing - see with terrains
    //procedural sky - creating a shader that simulates a realistic sky, complete with clouds, sun, and atmospheric effects.
    //rain/snow/star particle system
//procedural terrain generation with three js
//add light sources
//add auto movement through
//add arrow controls
//add fog
//make tree blender model
//make house blender model
//make bush blender model
//auto gen and add in


//l2
//dirt + leveled + smoke + fallen down trees

//menu

//need to use glsl tfr custom shaders