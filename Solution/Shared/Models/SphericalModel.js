import {BlenderModel} from "./BlenderModel.js";

/**
 *  The SphericalModel class: used for loading objects onto spherical surfaces
 */
export class SphericalModel extends BlenderModel {

    /**
     * Constructs a SphericalModel object
     * @param {number} r - The radial distance from the origin (radius).
     * @param {number} theta - The polar angle (longitude).
     * @param {number} phi - The azimuthal angle (latitude).
     * @param {number} scale - The scale factor applied to the model.
     * @param {number} negativeAdjustment - The negative adjustment applied to the radial distance to sink the object slightly
     * @param {string} filename - The filename of the Blender model.
     */
    constructor(r, theta, phi, scale, negativeAdjustment, filename) {
        super(filename);
        this.obj = this.circularInit(r, theta, phi, scale, negativeAdjustment);
    }

    /**
     * Asynchronously initialises the model by loading the Blender model, cloning it,
     * setting its position, scale, rotation, and shadow properties.
     * @param {number} r - The radial distance from the origin (radius).
     * @param {number} theta - The polar angle (longitude).
     * @param {number} phi - The azimuthal angle (latitude).
     * @param {number} scale - The scale factor applied to the model.
     * @param {number} negativeAdjustment - The negative adjustment applied to the radial distance to sink the object slightly
     * @returns A Promise that resolves to the initialised model.
     */
    async circularInit(r, theta, phi, scale, negativeAdjustment) {
        // Load the Blender model asynchronously
        const gltf = await BlenderModel.loadModel(this.filename);

        // Clone the loaded model and set its position, scale, rotation, and shadow properties
        let model = gltf.clone();
        model.position.setFromSphericalCoords(r - negativeAdjustment, phi, theta);
        model.scale.set(scale, scale, scale);
        model.lookAt(0, 0, 0);
        model.rotateX(Math.PI * 1.5);
        model.castShadow = true;
        model.receiveShadow = true;

        // Return the initialised model
        return model;
    }

    /**
     * Adds the model to the specified scene once the asynchronous initialisation is complete.
     * @param {THREE.Scene} scene - The scene to which the spherical model is added.
     */
    add(scene) {
        // Add the model to the scene once it is initialized
        this.obj.then(r => scene.add(r));
    }
}
