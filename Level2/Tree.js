import {GLTFLoader} from "three/addons";
import {BlenderModel} from "./BlenderModel";

export class Tree extends BlenderModel{

    constructor(r, theta, phi, scale) {
        super(r, theta, phi, scale, "../lowPolyTree.glb", 15);
    }
}