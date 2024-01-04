import {GLTFLoader} from "three/addons";

export class Tree{
    obj;

    //how to add shaders to gltf? - normal fog?
    constructor(r, theta, phi, scale) {
        this.obj = this.init(r, theta, phi, scale)

    }

    static gltf = Tree.loadTree()

    async init(r, theta, phi, scale){
        let tree = (await Tree.gltf).clone()
        tree.position.setFromSphericalCoords(r-10, phi, theta)
        tree.scale.set(scale, scale, scale)

        tree.lookAt(0, 0, 0)
        tree.rotateX(Math.PI*1.5)

        tree.castShadow = true
        tree.receiveShadow = true

        return tree;
    }

    static async loadTree(){
        let loader = new GLTFLoader()
        let gltf = await new Promise(resolve => loader.load("../lowPolyTree.glb",  (gltf)=> resolve(gltf)))
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