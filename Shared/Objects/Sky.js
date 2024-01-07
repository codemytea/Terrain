import * as THREE from "../../External Libraries/three/three.module.js";
import {Renderer} from "../Renderer.js";
import {Sky as ThreeSky} from "../../External Libraries/three/Addons/Sky.js";

//Game shows 3 different types of sky
export const menuSky = {
    turbidity: 7,
    rayleigh: 8,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.78,
    elevation: 2,
    azimuth: 180,
};

export const level2Sky = {
    turbidity: 3,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.99,
    elevation: 0,
    azimuth: 0,
};

export const level1Sky = {
    turbidity: 3,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.99,
    elevation: 5,
    azimuth: 100,
}


/**
 * Class to represent the sky
 * */
export class Sky {

    constructor(startSky) {
        this.sky = new ThreeSky();
        this.sky.scale.setScalar(45000);
        this.sun = new THREE.Vector3();

        startSky.exposure = Renderer.instance.renderer.toneMappingExposure

        // Set the look of the sky
        const uniforms = this.sky.material.uniforms;
        uniforms['turbidity'].value = startSky.turbidity;
        uniforms['rayleigh'].value = startSky.rayleigh;
        uniforms['mieCoefficient'].value = startSky.mieCoefficient;
        uniforms['mieDirectionalG'].value = startSky.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - startSky.elevation);
        const theta = THREE.MathUtils.degToRad(startSky.azimuth);

        this.sun.setFromSphericalCoords(1, phi, theta);

        uniforms['sunPosition'].value.copy(this.sun);

        Renderer.instance.renderer.toneMappingExposure = startSky.exposure;
    }

    add(scene) {
        scene.add(this.sky)
    }

}