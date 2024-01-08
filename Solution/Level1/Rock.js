import {PlanarModel} from "../Shared/Models/PlanarModel.js";

/**
 * Call new LumpyRock(x, y, z) to create a lumpy rock at that position
 * */
export class LumpyRock extends PlanarModel {
    constructor(x, y, z) {
        super(x, y, z, 0.4, "../Assets/lowPolyRockLumpy.glb");
    }
}

/**
 * call new Normal(x, y, z) to create a normal rock at that position
 * */
export class NormalRock extends PlanarModel {
    constructor(x, y, z) {
        super(x, y, z, 0.4, "../Assets/lowPolyRockNormal.glb");
    }
}


/**
 * Call new FlatRock(x, y, z) to create a flat rock at that position
 * */
export class FlatRock extends PlanarModel {
    constructor(x, y, z) {
        super(x, y, z, 0.6, "../Assets/lowPolyRockFlat.glb");
    }
}