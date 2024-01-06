import * as THREE from "three";
import {getRandomXYZAvoiding} from "../Shared/utils";
import {FieldTree} from "../Shared/Objects/Tree";
import {FlatRock, LumpyRock, NormalRock} from "./Rock";

export class WorldTerrain{
    mesh;
    world

    constructor() {
        this.mesh = this.init()
    }

    init(){
        return new Promise((r) => {
            this.world = new THREE.PlaneGeometry(100, 100, 50, 50)
            this.world.rotateX(-Math.PI/2)

            let loader = new THREE.TextureLoader();

            loader.load('../grass.png', (t)=> {
                t.wrapS = THREE.RepeatWrapping
                t.wrapT = THREE.RepeatWrapping
                t.repeat.set(10, 10)

                let mesh = new THREE.Mesh(world, new THREE.MeshStandardMaterial({map: t}));
                // mesh.receiveShadow = true
                // mesh.castShadow = true
                // mesh.position.set(0, 0, 0)
                r(mesh)

            })
        })

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

        this.mesh.then((r)=> {
            scene.add(r)
        })

        const houseLight = new THREE.PointLight(0xffffff, 200)
        houseLight.position.set(0, 2, 0)
        houseLight.power = 1000
        scene.add(houseLight)
    }

}




