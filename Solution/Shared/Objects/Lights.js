import * as THREE from "../../../External Libraries/three/three.module.js";


/**
 * Specifies Lights throughout the game
 * */
export class Lights {

    /**
     * Function for creating point lights and setting their attributes
     @param {number} x - The x-coordinate of the light's position.
     @param {number} y - The y-coordinate of the light's position.
     @param {number} z - The z-coordinate of the light's position.
     * */
    static PointLight(x, y, z) {
        const pl1 = new THREE.PointLight(0xffffff, 1000000000, 100000)
        pl1.castShadow = true
        pl1.position.set(x, y, z)
        pl1.shadow.radius = 100;
        pl1.shadow.mapSize.width = 2048
        pl1.shadow.mapSize.height = 2048
        return pl1
    }

    constructor() {
        this.lights = [
            Lights.PointLight(15000, 15000, -15000),
            Lights.PointLight(15000, 15000, 15000),
            new THREE.AmbientLight(0xffffff, 0)
        ]

    }

    add(scene) {
        this.lights.forEach((l) => scene.add(l))
    }
}