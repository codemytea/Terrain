import {BlenderModel} from "./BlenderModel.js";
import * as THREE from "../../External Libraries/three/three.module.js";

/**
 *  The SphericalModel class: used for loading objects onto spherical surfaces
 */
export class InstancedSphericalModel extends BlenderModel {


    constructor(filename, negativeAdjustment, instances) {
        super(filename);
        this.obj = this.init(negativeAdjustment, instances);
    }

    async init(negativeAdjustment, instances) {
        // Load the Blender model asynchronously
        const gltf = await BlenderModel.loadModel(this.filename);
        let meshes = []
        gltf.traverse((node) => {
            if (node.isMesh) {
                meshes.push(node)
            }
        });

        let models = []

        for (let mesh of meshes) {
            const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, instances.length)

            //Iterate through segments and instances
            for (let i = 0; i < instances.length; i++) {
                const instance = instances[i]

                let cartesian = new THREE.Vector3().setFromSphericalCoords(instance.radius - negativeAdjustment, instance.phi, instance.theta)

                //Create the object
                const obj = new THREE.Object3D()

                //Set the position
                obj.position.set(
                    cartesian.x,
                    cartesian.y,
                    cartesian.z
                )

                //Scale the object
                obj.scale.setScalar(instance.scale)

                //Rotate the object
                obj.rotation.y = Math.random() * Math.PI

                obj.lookAt(0, 0, 0);
                obj.rotateX(Math.PI * 1.5);
                obj.castShadow = true
                obj.receiveShadow = true

                //Add the object to the mesh
                obj.updateMatrix()
                instancedMesh.setMatrixAt(i, obj.matrix)
            }
            instancedMesh.castShadow = true
            instancedMesh.receiveShadow = true
            models.push(instancedMesh)
        }

        return models;
    }

    /**
     * Adds the model to the specified scene once the asynchronous initialisation is complete.
     * @param {THREE.Scene} scene - The scene to which the spherical model is added.
     */
    add(scene) {
        // Add the model to the scene once it is initialized
        this.obj.then(objs => {
            for (let o of objs) {
                scene.add(o)
            }
        });
    }
}
