import {GLTFLoader} from "three/addons";
import {BlenderModel} from "./BlenderModel";

export class LumpyRock extends BlenderModel{
    constructor(r, theta, phi, scale) {
        super(r, theta, phi, scale, "../lowPolyRockLumpy.glb", 2);
    }
}

export class NormalRock extends BlenderModel{
    constructor(r, theta, phi, scale) {
        super(r, theta, phi, scale, "../lowPolyRockNormal.glb", 2);
    }
}

export class FlatRock extends BlenderModel{
    constructor(r, theta, phi, scale) {
        super(r, theta, phi, scale, "../lowPolyRockFlat.glb", 2);
    }
}