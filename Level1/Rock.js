import {GLTFLoader} from "three/addons";
import {BlenderModel} from "../Shared/Models/BlenderModel";

export class LumpyRock extends BlenderModel{

    constructor(r, theta, phi, scale, isCircular, negativeAdjustment = 15) {
        super(r, theta, phi, scale, "../Assets/lowPolyTree.glb", negativeAdjustment, isCircular);
    }
}
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