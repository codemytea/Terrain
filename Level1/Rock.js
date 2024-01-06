import {GLTFLoader} from "three/addons";
import {PlanarModel} from "../Shared/Models/PlanarModel";

export class LumpyRock extends PlanarModel{
    constructor(x, y, z) {
        super(x, y, z, 1, "../Assets/lowPolyTree.glb");
    }
}

export class NormalRock extends PlanarModel{
    constructor(x, y, z) {
        super(x, y, z, 1, "../Assets/lowPolyRockNormal.glb");
    }
}

export class FlatRock extends PlanarModel{
    constructor(x, y, z) {
        super(x, y, z, 1, "../Assets/lowPolyRockFlat.glb");
    }
}