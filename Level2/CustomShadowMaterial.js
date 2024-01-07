//https://gist.github.com/wmcmurray/6696fc95f25bbd2401d72a74e9493261

import * as THREE from "../External Libraries/three/three.module.js";
import {mergeUniforms} from "../External Libraries/three/Addons/UniformsUtils.js";

const vertexShader = `
    varying vec3 vPosition;
    #include <common>
    #include <fog_pars_vertex>
    #include <shadowmap_pars_vertex>
    void main() {
        #include <begin_vertex>
        #include <beginnormal_vertex>
        #include <project_vertex>
        #include <worldpos_vertex>
        #include <defaultnormal_vertex>
        #include <shadowmap_vertex>
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = (customShader)=>`
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <dithering_pars_fragment>

${customShader}
void main() {
 
  vec3 finalColor = getColour();
  vec3 shadowColor = vec3(0, 0, 0);
  float shadowPower = 0.5;
  gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
  #include <fog_fragment>
  #include <dithering_fragment>
}`;

export const CustomShadowMaterial = (myFragmentShader, uniforms)=>{
    return new THREE.ShaderMaterial({
        uniforms:
            mergeUniforms([
                THREE.UniformsLib.lights,
                THREE.UniformsLib.fog,
                uniforms
            ]),
        vertexShader: vertexShader,
        fragmentShader: fragmentShader(myFragmentShader),
        lights:true,
        dithering: true,
    });
}

