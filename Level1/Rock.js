import {GLTFLoader} from "three/addons";
import {BlenderModel} from "../Shared/BlenderModel";

export class LumpyRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(200, theta, phi, scale, "../Assets/lowPolyRockLumpy.glb", 2, false);
    }
}

export class NormalRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(200, theta, phi, scale, "../Assets/lowPolyRockNormal.glb", 2, false);
    }
}

export class FlatRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(200, theta, phi, scale, "../Assets/lowPolyRockFlat.glb", 2, false);
    }
}