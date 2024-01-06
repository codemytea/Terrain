import {BlenderModel} from "./BlenderModel";

export class PlanarModel extends BlenderModel{

    constructor(x, y, z, scale, filename) {
        super(filename)
        this.obj = this.planarInit(x, y, z, scale)
    }

    async planarInit(x, y, z, scale){
        const gltf = await BlenderModel.loadModel(this.filename)
        let model = gltf.clone()
        model.position.set(x, y, z)
        model.scale.set(scale, scale, scale)

        model.castShadow = true
        model.receiveShadow = true

        return model;

    }

    add(scene){
        this.obj.then(r => scene.add(r))
    }
}