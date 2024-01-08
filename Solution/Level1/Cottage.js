import {PlanarModel} from "../Shared/Models/PlanarModel.js";


/**
 * Call 'new Cottage()' to spawn in a Cottage at position (0, 0, 10), with scaled to 5
 * */
export class Cottage extends PlanarModel {

    constructor() {
        // Arguments: x , y , z, scale, and the path to the cottage model file
        super(0, 0, 10, 5, "../Assets/lowPolyCottage.glb");
    }
}