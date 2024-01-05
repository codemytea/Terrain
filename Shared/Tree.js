import {BlenderModel} from "./BlenderModel";

export class Tree extends BlenderModel{

    constructor(r, theta, phi, scale) {
        super(r, theta, phi, scale, "../Assets/lowPolyTree.glb", 15);
    }
}