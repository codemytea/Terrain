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

    constructor() {
        this.lights = [
           // Lights.PointLight(15000, 15000, -15000),
            Lights.PointLight(15000, 15000, 15000)
        ]


        const pl2 = new THREE.DirectionalLight(0xffffff, 0)
        pl2.position.set(0, 0, 1000)
        pl2.castShadow = true
        pl2.shadow.camera.near = 1;
        pl2.shadow.camera.far = 10000;

        const al = new THREE.AmbientLight(0xffffff, 0)
        //this.lights.push(al)


        //this.lights.push(pl2)

    }

    add(scene){
        this.lights.forEach((l)=>scene.add(l))
    }
}