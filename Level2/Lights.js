import * as THREE from "three";

export class Lights {

    constructor() {
        this.lights = []
        const pl1 = new THREE.DirectionalLight(0xffffff, 1)
        pl1.castShadow = true
        pl1.position.set(0, 0, -1000)

        const pl2 = new THREE.DirectionalLight(0xffffff, 1)
        pl2.position.set(0, 0, 1000)
        pl2.castShadow = true
        pl2.shadow.camera.near = 1;
        pl2.shadow.camera.far = 10000;

        const al = new THREE.AmbientLight(0xffffff, 1)


        this.lights.push(pl2)

    }

    add(scene){
        scene.add(...this.lights)
    }
}