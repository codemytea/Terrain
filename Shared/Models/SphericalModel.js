import {BlenderModel} from "./BlenderModel";

export class SphericalModel extends BlenderModel{
    constructor(r, theta, phi, scale, negativeAdjustment, filename) {
        super(filename)
        this.obj = this.circularInit(r, theta, phi, scale, negativeAdjustment)

    }

    async circularInit(r, theta, phi, scale, negativeAdjustment){
        const gltf = await BlenderModel.loadModel(this.filename)
        let model = gltf.clone()
        model.position.setFromSphericalCoords(r - negativeAdjustment, phi, theta)
        model.scale.set(scale, scale, scale)

        model.lookAt(0, 0, 0)
        model.rotateX(Math.PI*1.5)

        model.castShadow = true
        model.receiveShadow = true

        return model;
    }

    add(scene){
        this.obj.then(r => scene.add(r))
    }
}