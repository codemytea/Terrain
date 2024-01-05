import * as THREE from "three";

export class WorldTerrain{
    mesh;
    world;

    constructor() {
        this.world = new THREE.SphereGeometry(200, 50, 50);

        this.mesh = new THREE.Mesh(this.world, new THREE.MeshBasicMaterial());
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.mesh.position.set(0, 0, 0)
    }


    add(scene){
        scene.add(this.mesh);
    }
}

