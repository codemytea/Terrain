import {GLTFLoader} from "three/addons";
import {BlenderModel} from "../Shared/BlenderModel";

export class LumpyRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(100, theta, phi, scale, "../lowPolyRockLumpy.glb", 2);
    }
}

export class NormalRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(100, theta, phi, scale, "../lowPolyRockNormal.glb", 2);
    }
}

export class FlatRock extends BlenderModel{
    constructor(theta, phi, scale) {
        super(100, theta, phi, scale, "../lowPolyRockFlat.glb", 2);
    }
}