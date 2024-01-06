import {PlanarModel} from "../Shared/Models/PlanarModel";

export class House extends PlanarModel{

    constructor() {
        super(0, 0, 10, 5, "../Assets/lowPolyCottage.glb");
    }
}