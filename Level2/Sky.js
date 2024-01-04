import * as THREE from "three";
import {Renderer} from "./Renderer";
import {Sky as ThreeSky} from "three/addons/objects/Sky.js";

export class Sky{

    //time
    constructor() {
        this.sky = new ThreeSky();
        this.sky.scale.setScalar( 45000 );

        this.sun = new THREE.Vector3();

         this.effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: Renderer.instance.renderer.toneMappingExposure
        };

        this.updateSky()

    }

    add(scene){
        scene.add(this.sky)
    }

    updateSky(){
        const uniforms = this.sky.material.uniforms;
        uniforms[ 'turbidity' ].value = this.effectController.turbidity;
        uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
        const theta = THREE.MathUtils.degToRad( this.effectController.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( this.sun );

        Renderer.instance.renderer.toneMappingExposure = this.effectController.exposure;
    }

    onNewFrame(delta){
        //this.sky.material.uniforms.time.value += delta;
    }


}