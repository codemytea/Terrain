import {GLTFLoader} from "../../External Libraries/three/Addons/GLTFLoader.js";

/**
 * The BlenderModel class represents a 3D model loaded from a Blender file (.glb or .gltf).
 */
export class BlenderModel {
    filename;

    /**
     * Constructs a BlenderModel object with the specified filename.
     * @param {string} filename - The filename of the Blender model.
     */
    constructor(filename) {
        this.filename = filename;
    }

    /**
     * Asynchronously loads a Blender model from the specified filename using the GLTFLoader.
     * The loaded model is configured to cast and receive shadows.
     * @param {string} filename - The filename of the Blender model to load.
     * @returns  A Promise that resolves to the loaded 3D model's scene.
     */
    static async loadModel(filename) {
        // Create a GLTFLoader instance
        let loader = new GLTFLoader();

        // Load the model asynchronously and resolve the Promise with the loaded GLTF object
        let gltf = await new Promise(resolve => loader.load(filename, (gltf) => resolve(gltf)));

        // Configure shadows for each mesh in the loaded model's scene
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        // Configure the overall scene to cast and receive shadows
        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;

        // Return the loaded model's scene
        return gltf.scene;
    }
}
