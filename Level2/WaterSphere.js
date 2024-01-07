import * as THREE from "../External Libraries/three/three.module.js";
import {SimplexNoise} from "../External Libraries/three/Addons/SimplexNoise";
import {getRandomInt} from "../Shared/utils.js";
import {Renderer} from "../Shared/Renderer.js";


/**
 * The WaterSphere class creates a sphere resembling water, slightly smaller than the level 2
 * world terrain sphere, allowing it to be superimposed on the top.
 */
export class WaterSphere {

    /**
     * Constructs the WaterSphere object, initializing the water sphere geometry and material.
     */
    constructor() {
        // Create a cube render target for reflections
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        });

        // Create a cube camera for rendering reflections
        this.cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);

        const world = new THREE.SphereGeometry(990, 300, 300);

        // Extract vertex positions and normals from the geometry
        const vertexPositions = world.getAttribute('position').array;
        const vertexNormals = world.getAttribute('normal').array;

        // Use simplex noise to create a dynamic water-like surface
        const simplex = new SimplexNoise();
        let temp = getRandomInt(10, 20);

        for (let i = 0; i < vertexPositions.length; i += 3) {
            let relativeVertexPosition = simplex.noise3d(vertexPositions[i] / temp, vertexPositions[i + 1] / temp, vertexPositions[i + 2] / temp);
            // Extend the vertex along its normal
            vertexPositions[i] += vertexNormals[i] * relativeVertexPosition * 5;
            vertexPositions[i + 1] += vertexNormals[i + 1] * relativeVertexPosition * 5;
            vertexPositions[i + 2] += vertexNormals[i + 2] * relativeVertexPosition * 5;
        }

        // Mark the geometry for update
        world.verticesNeedUpdate = true;

        // Create material with water-like properties
        const material = new THREE.MeshPhongMaterial({
            color: 0xbbbbff, // Deep blue color
            transparent: true,
            opacity: 0.8,
            reflectivity: 0.5,
            refractionRatio: 0.9,
            shininess: 25,
            envMap: cubeRenderTarget.texture,
            specular: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
        });

        this.mesh = new THREE.Mesh(world, material)
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
    }

    /**
     * Adds the water sphere to the given scene.
     * @param {THREE.Scene} scene - The scene to which the water sphere is added.
     */
    add(scene) {
        this.scene = scene;
        scene.add(this.mesh);
    }

    /**
     * Updates the cube camera for reflections on each frame.
     * @param {number} delta - The time difference between frames.
     */
    onNewFrame(delta) {
        this.cubeCamera.update(Renderer.instance.renderer, this.scene);
    }
}
