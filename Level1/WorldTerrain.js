import * as THREE from "three";
import {FrontSide, Plane} from "three";

export class WorldTerrain{
    mesh;

    constructor(PLANE_SIZE = 30, BLADE_COUNT = 100000, BLADE_WIDTH = 0.1, BLADE_HEIGHT = 0.8, BLADE_HEIGHT_VARIATION = 0.6) {
        const world = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE)

        this.mesh = new THREE.Mesh(world) //grassbuffer?)

    }


    add(scene){
        scene.add(this.mesh)

    }

}


