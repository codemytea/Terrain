import * as THREE from "three";
import {FrontSide, Plane} from "three";

export class WorldTerrain{
    mesh;

    constructor() {
        const world = new THREE.PlaneGeometry(100, 100)
        world.rotateX(-Math.PI/2)
        //add soil texture to it
        this.mesh = new THREE.Mesh(world, new THREE.MeshBasicMaterial())
    }


    add(scene){
        scene.add(this.mesh)

    }

}


