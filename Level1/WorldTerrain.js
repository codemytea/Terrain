import * as THREE from "three";
import {getRandomXYZAvoiding} from "../Shared/utils";
import {FieldTree} from "../Shared/Objects/Tree";
import {FlatRock, LumpyRock, NormalRock} from "./Rock";

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
            trees.push(
                new FieldTree(
                    ...getRandomXYZAvoiding(90, 45, [10, 90])
                )
            )
        }
        return trees
    }


    getRandomRocks(density){
        let numberOfRocks = (this.world.attributes.position.array.length * density)
        let rocks = []
        for (let i = 0; i<numberOfRocks; i+=3){
            rocks.push(
                new LumpyRock(
                    ...getRandomXYZAvoiding(90, 45, [30, 70])
                )
            )
            rocks.push(
                new NormalRock(
                    ...getRandomXYZAvoiding(90, 45, [30, 70])
                )
            )
            rocks.push(
                new FlatRock(
                    ...getRandomXYZAvoiding(90, 45, [30, 70])
                )
            )
        }
        return rocks
    }


    add(scene){
        scene.add(this.mesh)
        const houseLight = new THREE.PointLight(0xffffff, 200)
        houseLight.position.set(0, 2, 0)
        houseLight.power = 1000
        scene.add(houseLight)
    }

}


