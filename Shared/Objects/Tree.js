import {SphericalModel} from "../Models/SphericalModel.js";
import {getRandomInt} from "../utils.js";
import {PlanarModel} from "../Models/PlanarModel.js";

/**
 * Call new WorldTree(r, theta, phi) to create a tree on a sphere
 * */
export class WorldTree extends SphericalModel {
    constructor(r, theta, phi) {
        super(r, theta, phi, getRandomInt(2, 3), 5, "../../Assets/lowPolyTree.glb")
    }

}

/**
 * Call new FieldTree(x, y, z) to create a tree on a flat plane
 * */
export class FieldTree extends PlanarModel {
    constructor(x, y, z) {
        super(x, y, z, 0.5, "../../Assets/lowPolyTree.glb")
    }
}