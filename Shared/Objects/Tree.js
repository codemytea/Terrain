import {SphericalModel} from "../Models/SphericalModel";
import {getRandomInt} from "../utils";
import {PlanarModel} from "../Models/PlanarModel";

export class WorldTree extends SphericalModel {
    constructor(r, theta, phi) {
        super(r, theta, phi, getRandomInt(3, 20), 15, "../../Assets/lowPolyTree.glb")
    }

}

export class FieldTree extends PlanarModel {
    constructor(x, y, z) {
        super(x, y, z, 1, "../../Assets/lowPolyTree.glb")
    }
}