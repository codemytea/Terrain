import {BlenderModel} from "../Shared/BlenderModel";

export class House extends BlenderModel{

    constructor() {
        super(0, 0, 0, 5, "../Assets/lowPolyCottage.glb", 0, false);
    }
}