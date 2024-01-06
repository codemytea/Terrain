import {BlenderModel} from "../Shared/BlenderModel";

export class House extends BlenderModel{

    constructor(theta, phi) {
        super(0, theta, phi, 5, "../Assets/lowPolyCottage.glb", 0, false);
    }
}