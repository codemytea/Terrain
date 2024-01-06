import * as THREE from "three";
import {FrontSide, Plane, Spherical} from "three";
import {getRandomFloat, getRandomInt} from "../Shared/utils";
import {Tree} from "../Shared/Tree";

export class WorldTerrain{
    mesh;
    world

    constructor() {
        this.world = new THREE.PlaneGeometry(100, 100, 50, 50)
        this.world.rotateX(-Math.PI/2)
        //add soil texture to it
        this.mesh = new THREE.Mesh(this.world, new THREE.MeshBasicMaterial())
    }

    getRandomTrees(density){
        let numberOfTrees = this.world.attributes.position.array.length * density
        let trees = []
        for (let i = 0; i<numberOfTrees; i++){
            trees.push(new Tree(0, getRandomFloat(50, 100), 0, 1, false, getRandomFloat(50, 100)))

        }
        return trees

    }


    getRandomRocks(density){

    }


    add(scene){
        scene.add(this.mesh)

    }

}


