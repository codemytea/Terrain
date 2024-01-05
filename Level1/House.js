import {BlenderModel} from "../Shared/BlenderModel";

export class House extends BlenderModel{

    constructor(theta, phi) {
        super(200, theta, phi, 15, "../Assets/lowPolyCottage.glb", 1);
    }
}