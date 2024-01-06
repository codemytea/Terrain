import {BlenderModel} from "../Models/BlenderModel";

export class Tree extends BlenderModel{

    constructor(r, theta, phi, scale, isCircular, negativeAdjustment = 15) {
        super(r, theta, phi, scale, "../Assets/lowPolyTree.glb", negativeAdjustment, isCircular);
    }
}