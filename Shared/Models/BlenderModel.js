import {GLTFLoader} from "three/addons";

export class BlenderModel{
    filename;

    constructor(filename) {
        this.filename = filename
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
}