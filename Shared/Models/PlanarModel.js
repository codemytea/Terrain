import {BlenderModel} from "./BlenderModel.js";

/**
 * The PlanarModel class: used for loading objects onto flat (non-spherical) surfaces
 */
export class PlanarModel extends BlenderModel {

    /**
     * Constructs a PlanarModel object with the specified position, scale, and Blender model filename.
     * @param {number} x - The x-coordinate of the model's position.
     * @param {number} y - The y-coordinate of the model's position.
     * @param {number} z - The z-coordinate of the model's position.
     * @param {number} scale - The scale factor applied to the model.
     * @param {string} filename - The filename of the Blender model.
     */
    constructor(x, y, z, scale, filename) {
        super(filename);
        this.obj = this.planarInit(x, y, z, scale);
    }

    /**
     * Asynchronously initialises the planar model by loading the Blender model, cloning it,
     * setting its position, scale, and shadow properties.
     * @param {number} x - The x-coordinate of the model's position.
     * @param {number} y - The y-coordinate of the model's position.
     * @param {number} z - The z-coordinate of the model's position.
     * @param {number} scale - The scale factor applied to the model.
     * @returns A Promise that resolves to the initialised planar model.
     */
    async planarInit(x, y, z, scale) {
        // Load the Blender model asynchronously
        const gltf = await BlenderModel.loadModel(this.filename);

        // Clone the loaded model and set its position, scale, and shadow properties
        let model = gltf.clone();
        model.position.set(x, y, z);
        model.scale.set(scale, scale, scale);
        model.castShadow = true;
        model.receiveShadow = true;

        // Return the initialized planar model
        return model;
    }

    /**
     * Adds the planar model to the specified scene once the asynchronous initialisation is complete.
     * @param {THREE.Scene} scene - The scene to which the planar model is added.
     */
    add(scene) {
        // Add the planar model to the scene once it is initialized
        this.obj.then(r => scene.add(r));
    }
}
