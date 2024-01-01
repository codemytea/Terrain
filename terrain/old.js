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


`const fogFrag = \`
#ifdef USE_FOG
  vec3 windDir = vec3(0.0, 0.0, time);
  vec3 scrollingPos = vFogWorldPosition.xyz + fogNoiseSpeed * windDir;  
  float noise = cnoise(fogNoiseFreq * scrollingPos.xyz);
  float vFogDepth = (1.0 - fogNoiseImpact * noise) * fogDepth;
  #ifdef FOG_EXP2
  float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
  float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, mix(fogNearColor, fogColor, fogFactor), fogFactor );
#endif

\`;`

const fogParsFrag = `
#ifdef USE_FOG
  ${noise}
	uniform vec3 fogColor;
  uniform vec3 fogNearColor;
	varying float fogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
  varying vec3 vFogWorldPosition;
  uniform float time;
  uniform float fogNoiseSpeed;
  uniform float fogNoiseFreq;
  uniform float fogNoiseImpact;
#endif


var params = {
    fogNearColor: 0xfc4848,
    fogHorizonColor: 0xe4dcff,
    fogDensity: 0.0025,
    fogNoiseSpeed: 100,
    fogNoiseFreq: .0012,
    fogNoiseImpact: .5
};

init();

























