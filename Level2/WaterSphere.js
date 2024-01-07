import * as THREE from "three";
import {SimplexNoise} from "three/addons";
import {getRandomInt} from "../Shared/utils";
import {Renderer} from "../Shared/Renderer";

export class WaterSphere{
    constructor() {
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        })

        this.cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)

        const world = new THREE.SphereGeometry(990, 300, 300);

        const vertexPositions = world.getAttribute('position').array;
        const vertexNormals = world.getAttribute('normal').array;

        const simplex = new SimplexNoise();
        let temp = getRandomInt(10, 20);


        for (let i = 0; i < vertexPositions.length; i += 3) {

            let relativeVertexPosition = simplex.noise3d(vertexPositions[i]/temp, vertexPositions[i+1]/temp, vertexPositions[i+2]/temp);
            // Extend the vertex along its normal
            vertexPositions[i] += vertexNormals[i] * relativeVertexPosition *5;
            vertexPositions[i + 1] += vertexNormals[i + 1] * relativeVertexPosition*5 ;
            vertexPositions[i + 2] += vertexNormals[i + 2] * relativeVertexPosition*5;
        }

        world.verticesNeedUpdate = true;


        const material = new THREE.MeshPhongMaterial({
            color: 0xbbbbff, // Deep blue color
            transparent: true,
            opacity: 0.8,
            reflectivity: 0.5,
            refractionRatio: 0.9, // Adjust the refraction ratio
            shininess: 25, // Adjust shininess for specular highlights
            envMap: cubeRenderTarget.texture,
            specular: 0xffffff, // Adjust specular color
            emissive: 0xffffff, // No emissive color
            emissiveIntensity: 0.5,
        });

        this.mesh = new THREE.Mesh(world, material)
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
    }

    add(scene){
        this.scene = scene
        scene.add(this.mesh)
    }

    onNewFrame(delta){
        this.cubeCamera.update( Renderer.instance.renderer, this.scene );
    }


}