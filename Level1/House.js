import {BlenderModel} from "../Shared/BlenderModel";

export class House extends BlenderModel{

    constructor(theta, phi) {
        super(100, theta, phi, 1, "../lowPolyCottage.glb", 2);
    }
}