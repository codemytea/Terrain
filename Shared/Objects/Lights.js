import * as THREE from "three";

export class Lights {

    static PointLight(x, y, z){
        const pl1 = new THREE.PointLight(0xffffff, 1000000000, 100000)
        pl1.castShadow = true
        pl1.position.set(x, y, z)
        pl1.shadow.radius = 1000;
        pl1.shadow.mapSize.width = 20000
        pl1.shadow.mapSize.height = 20000
        return pl1
    }

    constructor(light1, light2) {
        this.lights = [
            Lights.PointLight(15000, 15000, -15000),
            Lights.PointLight(15000, 15000, 15000)
        ]

        const al = new THREE.AmbientLight(0xffffff, 0)
        this.lights.push(al)

    }

    add(scene){
        this.lights.forEach((l)=>scene.add(l))
    }
}