import {BlenderModel} from "./BlenderModel";

export class Tree extends BlenderModel{

    constructor(r, theta, phi, scale, isCircular) {
        super(r, theta, phi, scale, "../Assets/lowPolyTree.glb", 15, isCircular);
    }
}