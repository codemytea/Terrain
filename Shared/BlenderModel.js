import {GLTFLoader} from "three/addons";

export class BlenderModel{
    obj;
    filename;

    constructor(r, theta, phi, scale, filename, negativeAdjustment, isCircular) {
        this.filename = filename
        if (isCircular){
            this.obj = this.circularInit(r, theta, phi, scale, negativeAdjustment)
        } else {
            this.obj = this.planarInit(theta, phi, negativeAdjustment, scale)
        }

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

    async planarInit(x, y, z, scale){
        const gltf = await BlenderModel.loadModel(this.filename)
        let model = gltf.clone()
        model.position.set(x, y, z)
        model.scale.set(scale, scale, scale)

        model.castShadow = true
        model.receiveShadow = true

        return model;
    }

    static async loadModel(filename){
        let loader = new GLTFLoader()
        let gltf = await new Promise(resolve => loader.load(filename,  (gltf)=> resolve(gltf)))
        gltf.scene.traverse((node)=>{
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        gltf.scene.castShadow = true
        gltf.scene.receiveShadow = true

        return gltf.scene
    }

    add(scene){
        this.obj.then(r => scene.add(r))
    }
}