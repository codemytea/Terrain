import * as THREE from "three";
import {Renderer} from "./Renderer";
import {Sky as ThreeSky} from "three/addons/objects/Sky.js";


export const MORNING_SKY = {
    turbidity: 7,
    rayleigh: 8,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.78,
    elevation: 2,
    azimuth: 180,
};

export const DUSTY_EVENING_SKY = {
    turbidity: 3,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.99,
    elevation: 0,
    azimuth: 180,
};

export const NIGHT_SKY = {
    turbidity: 0.3,
    rayleigh: 0,
    mieCoefficient: 0.0002,
    mieDirectionalG: 0.99,
    elevation: 25.8,
    azimuth: 180,
    exposure: 0.00000002
}


export const MIDDAY_SKY = {
    turbidity: 20,
    rayleigh: 4,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.98,
    elevation: 90,
    azimuth: 25,
    exposure: 0.13
};


export class Sky{

    //time
    constructor(startSky) {
        this.sky = new ThreeSky();
        this.sky.scale.setScalar( 45000 );

        this.sun = new THREE.Vector3();

        startSky.exposure = Renderer.instance.renderer.toneMappingExposure

         
    
        this.updateSky(startSky)

    }

    add(scene){
        scene.add(this.sky)
    }

    updateSky(skyParams){
        const uniforms = this.sky.material.uniforms;
        uniforms[ 'turbidity' ].value = skyParams.turbidity;
        uniforms[ 'rayleigh' ].value = skyParams.rayleigh;
        uniforms[ 'mieCoefficient' ].value = skyParams.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = skyParams.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - skyParams.elevation );
        const theta = THREE.MathUtils.degToRad( skyParams.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( this.sun );

        Renderer.instance.renderer.toneMappingExposure = skyParams.exposure;
    }

    onNewFrame(delta){
        //this.sky.material.uniforms.time.value += delta;
    }


}