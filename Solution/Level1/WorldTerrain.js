import * as THREE from "../../External Libraries/three/three.module.js";
import {getRandomXYZAvoiding} from "../Shared/utils.js";
import {FieldTree} from "../Shared/Objects/Tree.js";
import {FlatRock, LumpyRock, NormalRock} from "./Rock.js";

/**
 * Represents the world of Level 1.
 * */
export class WorldTerrain {
    mesh;
    world;

    constructor() {
        this.mesh = this.init();
    }

    /**
     * Initialises world terrain asynchronously due to texture loading
     * */
    init() {
        return new Promise((resolve) => {
            this.world = new THREE.PlaneGeometry(100, 100, 50, 50);
            this.world.rotateX(-Math.PI / 2); // Rotate the world geometry to be horizontal

            let loader = new THREE.TextureLoader();

            // Load the earth texture for underneath the grass
            loader.load('../Assets/muddy_ground.png', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10);


                let mesh = new THREE.Mesh(this.world, new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                }));
                mesh.receiveShadow = true;
                mesh.castShadow = true;
                mesh.position.set(0, 0, 0);
                resolve(mesh);
            });
        });
    }

    /**
     * Generates an array of random trees based on a given density. Avoids the cottage.
     *
     * @param density the tree density
     * @return array of trees
     * */
    getRandomTrees(density) {
        let numberOfTrees = this.world.attributes.position.array.length * density;
        let trees = [];
        for (let i = 0; i < numberOfTrees; i++) {
            trees.push(
                new FieldTree(
                    ...getRandomXYZAvoiding(100, 50, [38, 62])
                )
            );
        }
        return trees;
    }

    /**
     * Generates an array of different types of random rocks based on a given density. Avoids the cottage.
     *
     * @param density the rock density
     * @return array of rocks
     * */
    getRandomRocks(density) {
        let numberOfRocks = this.world.attributes.position.array.length * density;
        let rocks = [];
        for (let i = 0; i < numberOfRocks; i += 3) {
            rocks.push(
                new LumpyRock(
                    ...getRandomXYZAvoiding(100, 50, [38, 62])
                )
            );
            rocks.push(
                new NormalRock(
                    ...getRandomXYZAvoiding(100, 50, [38, 62])
                )
            );
            rocks.push(
                new FlatRock(
                    ...getRandomXYZAvoiding(100, 50, [38, 62])
                )
            );
        }
        return rocks;
    }


    add(scene) {

        this.mesh.then((r) => {
            scene.add(r)
        })

        const houseLight = new THREE.PointLight(0xffffff, 200)
        houseLight.position.set(0, 2, 0)
        houseLight.power = 1000
        scene.add(houseLight)
    }
}
